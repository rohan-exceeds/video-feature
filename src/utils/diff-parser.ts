interface Hunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  changes: {
    type: 'remove' | 'add';
    line: string;
    lineNumber: number;
    originalLine?: string;
  }[];
}

interface DiffResult {
  before: string;
  after: string;
}

function analyzeGitDiff(currentFile: string, diff: string): DiffResult {
  // Parse the diff to get the changes
  const diffLines = diff.split('\n');
  const changes: Hunk[] = [];
  let currentHunk: Hunk | null = null;

  for (let i = 0; i < diffLines.length; i++) {
    const line = diffLines[i];
    
    // Parse diff header
    if (line.startsWith('diff --git')) {
      continue;
    }
    
    // Parse hunk header
    if (line.startsWith('@@')) {
      const match = line.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
      if (match) {
        currentHunk = {
          oldStart: parseInt(match[1]),
          oldLines: parseInt(match[2]),
          newStart: parseInt(match[3]),
          newLines: parseInt(match[4]),
          changes: []
        };
        changes.push(currentHunk);
      }
      continue;
    }
    
    // Parse changes
    if (currentHunk) {
      if (line.startsWith('-')) {
        // Line was removed
        currentHunk.changes.push({
          type: 'remove',
          line: line.substring(1),
          lineNumber: currentHunk.oldStart + currentHunk.changes.filter(c => c.type === 'remove').length
        });
      } else if (line.startsWith('+')) {
        // Line was added
        const addedLineNumber = currentHunk.newStart + currentHunk.changes.filter(c => c.type === 'add').length;
        currentHunk.changes.push({
          type: 'add',
          line: line.substring(1),
          lineNumber: addedLineNumber,
          originalLine: diffLines[i - 1]?.substring(1) // Get the context line before this addition
        });
      }
    }
  }

  // Create before and after versions
  const fileLines = currentFile.split('\n');
  const beforeLines = [...fileLines];
  const afterLines = [...fileLines];
  const beforeComments: { index: number; comment: string }[] = [];
  const afterChanges: { index: number; type: 'add' | 'remove'; content: string }[] = [];

  // Process the changes in order
  for (const hunk of changes) {
    for (const change of hunk.changes) {
      if (change.type === 'remove') {
        // Find where to insert the comment by looking for the line to be removed
        const lineIndex = beforeLines.findIndex(line => line.trim() === change.line.trim());
        if (lineIndex !== -1) {
          beforeComments.push({
            index: lineIndex,
            comment: "// !block(1:1) 0,3,red"
          });
        }
        afterChanges.push({
          index: change.lineNumber - 1,
          type: 'remove',
          content: change.line
        });
      } else if (change.type === 'add') {
        // Find where to insert the addition by looking for the context line
        const contextLine = change.originalLine;
        const insertIndex = contextLine ? 
          afterLines.findIndex(line => line.trim() === contextLine.trim()) + 1 :
          change.lineNumber - 1;

        afterChanges.push({
          index: insertIndex,
          type: 'add',
          content: "// !block(1:1) 0,3,teal"
        });
        afterChanges.push({
          index: insertIndex,
          type: 'add',
          content: change.line
        });
      }
    }
  }

  // Apply comments to before version
  beforeComments.sort((a, b) => b.index - a.index);
  for (const { index, comment } of beforeComments) {
    beforeLines.splice(index, 0, comment);
  }

  // Apply changes to after version
  const finalAfterLines: string[] = [];
  let currentIndex = 0;
  let skipIndices = new Set<number>();

  // First, collect all lines that should be removed
  afterChanges.forEach(change => {
    if (change.type === 'remove') {
      const lineIndex = afterLines.findIndex(line => line.trim() === change.content.trim());
      if (lineIndex !== -1) {
        skipIndices.add(lineIndex);
      }
    }
  });

  // Sort changes by line number
  afterChanges.sort((a, b) => a.index - b.index);
  
  // Process each line from the original file
  for (let i = 0; i < afterLines.length || currentIndex < afterChanges.length; i++) {
    // Add any changes that should go at this position
    while (currentIndex < afterChanges.length && afterChanges[currentIndex].index === i) {
      const change = afterChanges[currentIndex];
      if (change.type === 'add') {
        finalAfterLines.push(change.content);
      }
      currentIndex++;
    }
    
    // Add the original line if it wasn't removed
    if (i < afterLines.length && !skipIndices.has(i)) {
      finalAfterLines.push(afterLines[i]);
    }
  }

  return {
    before: beforeLines.join('\n'),
    after: finalAfterLines.join('\n')
  };
}

// Example usage
function analyzeDiffExample() {
  const currentFile = 
`import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Card } from '@material-ui/core';
import { fetchUserData, updateProfile } from '../actions/userActions';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { validateProfileData } from '../utils/validation';
import styles from './Profile.module.css';

interface ProfileProps {
  userId: string;
  isEditable?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ userId, isEditable = false }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    dispatch(fetchUserData(userId));
  }, [dispatch, userId]);
  
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || ''
      });
    }
  }, [userData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateProfileData(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    dispatch(updateProfile(userId, formData));
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return (
    <Card className={styles.profileCard}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleInputChange}
          error={!!validationErrors.name}
          helperText={validationErrors.name}
          disabled={!isEditable}
          fullWidth
          margin="normal"
        />
        
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          error={!!validationErrors.email}
          helperText={validationErrors.email}
          disabled={!isEditable}
          fullWidth
          margin="normal"
        />
        
        <TextField
          name="bio"
          label="Bio"
          value={formData.bio}
          onChange={handleInputChange}
          error={!!validationErrors.bio}
          helperText={validationErrors.bio}
          disabled={!isEditable}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        
        <TextField
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleInputChange}
          error={!!validationErrors.location}
          helperText={validationErrors.location}
          disabled={!isEditable}
          fullWidth
          margin="normal"
        />
        
        <TextField
          name="website"
          label="Website"
          value={formData.website}
          onChange={handleInputChange}
          error={!!validationErrors.website}
          helperText={validationErrors.website}
          disabled={!isEditable}
          fullWidth
          margin="normal"
        />
        
        {isEditable && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            Save Changes
          </Button>
        )}
      </form>
    </Card>
  );
};

export default Profile;`;

  const diff = 
`@@ -1,6 +1,7 @@
 import React, { useEffect, useState } from 'react';
 import { useDispatch, useSelector } from 'react-redux';
 import { TextField, Button, Card } from '@material-ui/core';
+import { CircularProgress } from '@material-ui/core';
 import { fetchUserData, updateProfile } from '../actions/userActions';
-import { LoadingSpinner } from '../components/common/LoadingSpinner';
 import { ErrorMessage } from '../components/common/ErrorMessage';
 import { validateProfileData } from '../utils/validation';
@@ -22,6 +23,7 @@ const Profile: React.FC<ProfileProps> = ({ userId, isEditable = false }) => {
   const userData = useSelector((state) => state.user.data);
   const loading = useSelector((state) => state.user.loading);
   const error = useSelector((state) => state.user.error);
+  const [isSaving, setIsSaving] = useState(false);
   
   const [formData, setFormData] = useState({
     name: '',
@@ -63,12 +65,14 @@ const Profile: React.FC<ProfileProps> = ({ userId, isEditable = false }) => {
   
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
+    setIsSaving(true);
     
     const errors = validateProfileData(formData);
     if (Object.keys(errors).length > 0) {
       setValidationErrors(errors);
+      setIsSaving(false);
       return;
     }
     
-    dispatch(updateProfile(userId, formData));
+    await dispatch(updateProfile(userId, formData));
+    setIsSaving(false);
   };
@@ -76,7 +80,7 @@ const Profile: React.FC<ProfileProps> = ({ userId, isEditable = false }) => {
   if (loading) {
-    return <LoadingSpinner />;
+    return <CircularProgress className={styles.loadingSpinner} />;
   }
   
   if (error) {
@@ -84,6 +88,7 @@ const Profile: React.FC<ProfileProps> = ({ userId, isEditable = false }) => {
   }
   
   return (
+    <div className={styles.container}>
     <Card className={styles.profileCard}>
       <form onSubmit={handleSubmit}>
         <TextField
@@ -140,10 +145,13 @@ const Profile: React.FC<ProfileProps> = ({ userId, isEditable = false }) => {
             variant="contained"
             color="primary"
             className={styles.submitButton}
+            disabled={isSaving}
           >
-            Save Changes
+            {isSaving ? 'Saving...' : 'Save Changes'}
           </Button>
         )}
       </form>
     </Card>
+    </div>
   );
 };`;

  const fs = require('fs');
  const prettier = require('prettier');

  console.log('Current file:', currentFile);
  console.log('\nDiff:', diff);

  const versions = analyzeGitDiff(currentFile, diff);
  
  console.log('\nBefore version:', versions.before);
  console.log('\nAfter version:', versions.after);
  
  // Prettify and save before version
  try {
      const formattedBefore = prettier.format(versions.before, { parser: 'typescript' });
      fs.writeFileSync('before.txt', formattedBefore);
      console.log('\nBefore version saved to before.txt');

      // Prettify and save after version
      const formattedAfter = prettier.format(versions.after, { parser: 'typescript' });
      fs.writeFileSync('after.txt', formattedAfter);
      console.log('After version saved to after.txt');
  } catch (error) {
      console.error('Error formatting code:', error);
  }
}

// Export the main functions so they can be imported elsewhere
export { analyzeGitDiff, analyzeDiffExample };

// Only run the example if this file is being run directly
if (require.main === module) {
  analyzeDiffExample();
}