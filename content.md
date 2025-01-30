## !!steps 0

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

// !focus(1:1)
// !mark(1:1) red
            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 1

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

// !focus(1:1)
// !focus(1:3)
          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 2

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

// !mark(1:3) green
            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 3

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

// !focus(1:1)

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              editMode &&

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 4

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

// !mark(1:1) green
            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              editMode &&

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 5

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

// !focus(1:1)
// !mark(1:1) red
              onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 6

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

// !focus(1:1)
// !focus(1:1)
            }

          >
            {str?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 7

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

// !mark(1:1) green
              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 8

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

// !focus(1:3)
// !mark(1:3) red
          >
            {str?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 9

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

// !focus(1:3)
// !focus(1:1)
        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 10

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

// !mark(1:1) green
          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 11

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

// !focus(1:1)
// !mark(1:1) red
              onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 12

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

// !focus(1:1)
// !focus(1:1)
            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 13

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

// !mark(1:1) green
              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 14

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

// !focus(1:1)

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              editMode &&

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 15

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

// !mark(1:1) green
            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              editMode &&

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 16

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

// !focus(1:1)
// !mark(1:1) red
              onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 17

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

// !focus(1:1)
// !focus(1:1)
            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 18

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

// !mark(1:1) green
              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 19

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

// !focus(1:3)
// !mark(1:3) red
          >
            {opp?.description}
          </span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 20

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

// !focus(1:3)
// !focus(1:1)
        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 21

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

// !mark(1:1) green
          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 22

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

// !focus(1:1)

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              editMode &&

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 23

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

// !mark(1:1) green
  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              editMode &&

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 24

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

// !focus(1:1)
// !mark(1:1) red
              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 25

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

// !focus(1:1)
// !focus(1:3)
            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 26

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

// !mark(1:3) green
              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 27

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

// !focus(1:4)
// !mark(1:4) red
            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 28

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

// !focus(1:4)
// !focus(1:4)
            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 29

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

// !mark(1:4) green
            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 30

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

// !focus(1:2)
// !mark(1:2) red
              {repoName}
            </span>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 31

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

// !focus(1:2)
// !focus(1:10)
          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 32

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

// !mark(1:10) green
              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 33

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

// !focus(1:1)

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```


## !!steps 34

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
"use client";
import { setSelectedDesignDoc } from "@/store/packageCreatorSlice";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Close from "@mui/icons-material/Close";
import { Checkbox, IconButton, Link } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkDownEditor from "../ui/MarkDownEditor";
import GoogleDrivePicker from "./GoogleDrivePicker";

export const Strength = ({
  strengths,
  editMode = false,
  onDataChange = () => {},
}: {
  strengths: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Strengths</p>
    <ul className="text-sm font-normal list-disc px-4">
      {strengths?.map((str: any, index: number) => (
        <li key={str?.strength + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"

            onBlur={(e) => onDataChange(index, "strength", e.target.innerText)}

            onBlur={(e) =>
              editMode && onDataChange(index, "strength", e.target.innerText)
            }

          >
            {str?.strength}
          </span>
          :{" "}
          <span
            contentEditable={editMode}

            dangerouslySetInnerHTML={{ __html: str?.description }}

            className="outline-none"
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {str?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Opportunity = ({
  opportunities,
  editMode = false,
  onDataChange = () => {},
}: {
  opportunities: any[];
  editMode: boolean;
  onDataChange: any;
}) => (
  <div
    className={`w-full border-1 ${
      editMode ? "bg-blue-50 border-blue-100" : "border-[#C9DBE9] "
    } rounded-xl p-4`}
  >
    <p className="text-[17px] font-semibold text-[#1A2636]">Opportunities</p>
    <ul className="text-sm font-normal list-disc px-4">
      {opportunities?.map((opp: any, index: number) => (
        <li key={opp?.opportunity + index}>
          <span
            contentEditable={editMode}
            className="font-semibold outline-none"
            onBlur={(e) =>

              onDataChange(index, "opportunity", e.target.innerText)

              editMode && onDataChange(index, "opportunity", e.target.innerText)

            }
          >
            {opp?.opportunity}
          </span>
          :{" "}
          <span

            dangerouslySetInnerHTML={{ __html: opp?.description }}

            contentEditable={editMode}
            className="outline-none "
            onBlur={(e) =>

              onDataChange(index, "description", e.target.innerText)

              editMode && onDataChange(index, "description", e.target.innerText)

            }

          >
            {opp?.description}
          </span>

          ></span>

        </li>
      ))}
    </ul>
  </div>
);

export const Artifact = ({
  viewOnly = false,
  tags = [],
  url = "",
  updatedAt = "",
  message = "",
  onCheck = () => {},
  checked = false,
  value,
  title = null,
  no = 0,
  artifactTitle = "Artifact",
  editMode = false,
  onArtifactChange = () => {},
  repoName = "",

  repoLink = "",

}: any) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  useMemo(() => editorRef.current?.setMarkdown(message), [message]);
  return (
    <div className="my-2">
      <div className="flex gap-2 items-center">
        {!viewOnly && (
          <Checkbox
            value={value}
            onChange={() => onCheck(value)}
            sx={{
              "&.Mui-checked": {
                color: "#4ED9EF",
              },
              color: "#29324166",
              padding: 0,
            }}
            checked={checked}
          />
        )}
        <p className="text-[#1A2636] text-[17px] font-semibold">
          {artifactTitle} {no && no}
        </p>
      </div>
      <div
        className={`my-2 ${
          editMode && "bg-blue-50 border-1 border-blue-100 p-3 rounded"
        } `}
      >
        {!!url && !editMode ? (
          <Link href={url} target="_blank" style={{ textDecoration: "none" }}>
            <span className="outline-none text-[#518AB9] font-semibold text-[17px] no-underline">
              {title}
            </span>
          </Link>
        ) : typeof title === "string" ? (
          <p className="text-[#518AB9] font-semibold text-[17px]">
            <span
              contentEditable={editMode}
              className="outline-none"

              onBlur={(e) => onArtifactChange("title", e.target.innerText)}

              onBlur={(e) =>
                editMode && onArtifactChange("title", e.target.innerText)
              }

            >
              {title}
            </span>
          </p>
        ) : (
          title
        )}

        <p>
          {!!repoName && (

            <span
              contentEditable={editMode}
              onBlur={(e) => onArtifactChange("repo_name", e.target.innerText)}
              className="text-sm font-medium pr-4 outline-none"

            <Link
              target="_blank"
              href={repoLink}
              style={{ textDecoration: "none" }}

            >

              {repoName}
            </span>

              <span
                contentEditable={editMode}
                onBlur={(e) =>
                  editMode && onArtifactChange("repo_name", e.target.innerText)
                }
                className="text-sm font-medium pr-4 outline-none"
              >
                {repoName}
              </span>
            </Link>

          )}
          {!!updatedAt && (
            <span className="my-1 text-[#1A2636] text-xs italic">
              Last updated: {updatedAt}
            </span>
          )}
        </p>

        {message && (
          <div
            onBlur={(e) =>

// !mark(1:1) green
              editMode &&

              onArtifactChange("message", editorRef.current?.getMarkdown())
            }
            className="text-sm text-[#1A2636] outline-none -m-3 "
          >
            <MarkDownEditor
              editorRef={editorRef}
              markdown={message}
              readOnly={!editMode}
              hideToolbar={true}
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap items-center mt-2">
          {tags.length > 0 &&
            tags.map((tag: any) => (
              <div
                key={tag}
                className="bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] "
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const DesignDocumentBody = () => {
  const dispatch = useDispatch();
  const selectedDesignDoc = useSelector(
    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,
  );
  return (
    <>
      <p className="text-[17px] font-semibold text-[#1A2636]">
        Select Files from Google Drive
      </p>
      <div className="my-4">
        {selectedDesignDoc.length > 0 &&
          selectedDesignDoc.map((doc: any) => (
            <div key={doc?.id} className="flex items-center gap-5">
              <div className="h-5 w-5">
                <img
                  src={doc?.iconUrl}
                  style={{ height: "auto", width: "100%" }}
                  alt={doc?.name}
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <div>
                  <p className="text-sm text-[#1A2636]">{doc?.name}</p>
                  <a
                    className="text-sm text-[#518AB9]"
                    target="_blank"
                    href={doc?.url}
                  >
                    {doc?.url}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      setSelectedDesignDoc(
                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),
                      ),
                    )
                  }
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
      </div>
      <GoogleDrivePicker
        onPick={(data) => {
          const newDocs = data?.docs.filter(
            (doc: any) =>
              !selectedDesignDoc.some(
                (selectedDoc: any) => selectedDoc.id === doc.id,
              ),
          );
          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));
        }}
      />
    </>
  );
};


```

