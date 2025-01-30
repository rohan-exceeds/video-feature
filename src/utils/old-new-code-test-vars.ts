export const oldCode = "\"use client\";\n" +
	"import { setSelectedDesignDoc } from \"@/store/packageCreatorSlice\";\n" +
	"import { MDXEditorMethods } from \"@mdxeditor/editor\";\n" +
	"import Close from \"@mui/icons-material/Close\";\n" +
	"import { Checkbox, IconButton, Link } from \"@mui/material\";\n" +
	"import { useMemo, useRef } from \"react\";\n" +
	"import { useDispatch, useSelector } from \"react-redux\";\n" +
	"import MarkDownEditor from \"../ui/MarkDownEditor\";\n" +
	"import GoogleDrivePicker from \"./GoogleDrivePicker\";\n" +
	"\n" +
	"export const Strength = ({\n" +
	"  strengths,\n" +
	"  editMode = false,\n" +
	"  onDataChange = () => {},\n" +
	"}: {\n" +
	"  strengths: any[];\n" +
	"  editMode: boolean;\n" +
	"  onDataChange: any;\n" +
	"}) => (\n" +
	"  <div\n" +
	"    className={`w-full border-1 ${\n" +
	"      editMode ? \"bg-blue-50 border-blue-100\" : \"border-[#C9DBE9] \"\n" +
	"    } rounded-xl p-4`}\n" +
	"  >\n" +
	"    <p className=\"text-[17px] font-semibold text-[#1A2636]\">Strengths</p>\n" +
	"    <ul className=\"text-sm font-normal list-disc px-4\">\n" +
	"      {strengths?.map((str: any, index: number) => (\n" +
	"        <li key={str?.strength + index}>\n" +
	"          <span\n" +
	"            contentEditable={editMode}\n" +
	"            className=\"font-semibold outline-none\"\n" +
	"            onBlur={(e) => onDataChange(index, \"strength\", e.target.innerText)}\n" +
	"          >\n" +
	"            {str?.strength}\n" +
	"          </span>\n" +
	"          :{\" \"}\n" +
	"          <span\n" +
	"            contentEditable={editMode}\n" +
	"            className=\"outline-none\"\n" +
	"            onBlur={(e) =>\n" +
	"              onDataChange(index, \"description\", e.target.innerText)\n" +
	"            }\n" +
	"          >\n" +
	"            {str?.description}\n" +
	"          </span>\n" +
	"        </li>\n" +
	"      ))}\n" +
	"    </ul>\n" +
	"  </div>\n" +
	");\n" +
	"\n" +
	"export const Opportunity = ({\n" +
	"  opportunities,\n" +
	"  editMode = false,\n" +
	"  onDataChange = () => {},\n" +
	"}: {\n" +
	"  opportunities: any[];\n" +
	"  editMode: boolean;\n" +
	"  onDataChange: any;\n" +
	"}) => (\n" +
	"  <div\n" +
	"    className={`w-full border-1 ${\n" +
	"      editMode ? \"bg-blue-50 border-blue-100\" : \"border-[#C9DBE9] \"\n" +
	"    } rounded-xl p-4`}\n" +
	"  >\n" +
	"    <p className=\"text-[17px] font-semibold text-[#1A2636]\">Opportunities</p>\n" +
	"    <ul className=\"text-sm font-normal list-disc px-4\">\n" +
	"      {opportunities?.map((opp: any, index: number) => (\n" +
	"        <li key={opp?.opportunity + index}>\n" +
	"          <span\n" +
	"            contentEditable={editMode}\n" +
	"            className=\"font-semibold outline-none\"\n" +
	"            onBlur={(e) =>\n" +
	"              onDataChange(index, \"opportunity\", e.target.innerText)\n" +
	"            }\n" +
	"          >\n" +
	"            {opp?.opportunity}\n" +
	"          </span>\n" +
	"          :{\" \"}\n" +
	"          <span\n" +
	"            contentEditable={editMode}\n" +
	"            className=\"outline-none \"\n" +
	"            onBlur={(e) =>\n" +
	"              onDataChange(index, \"description\", e.target.innerText)\n" +
	"            }\n" +
	"          >\n" +
	"            {opp?.description}\n" +
	"          </span>\n" +
	"        </li>\n" +
	"      ))}\n" +
	"    </ul>\n" +
	"  </div>\n" +
	");\n" +
	"\n" +
	"export const Artifact = ({\n" +
	"  viewOnly = false,\n" +
	"  tags = [],\n" +
	"  url = \"\",\n" +
	"  updatedAt = \"\",\n" +
	"  message = \"\",\n" +
	"  onCheck = () => {},\n" +
	"  checked = false,\n" +
	"  value,\n" +
	"  title = null,\n" +
	"  no = 0,\n" +
	"  artifactTitle = \"Artifact\",\n" +
	"  editMode = false,\n" +
	"  onArtifactChange = () => {},\n" +
	"  repoName = \"\",\n" +
	"}: any) => {\n" +
	"  const editorRef = useRef<MDXEditorMethods>(null);\n" +
	"  useMemo(() => editorRef.current?.setMarkdown(message), [message]);\n" +
	"  return (\n" +
	"    <div className=\"my-2\">\n" +
	"      <div className=\"flex gap-2 items-center\">\n" +
	"        {!viewOnly && (\n" +
	"          <Checkbox\n" +
	"            value={value}\n" +
	"            onChange={() => onCheck(value)}\n" +
	"            sx={{\n" +
	"              \"&.Mui-checked\": {\n" +
	"                color: \"#4ED9EF\",\n" +
	"              },\n" +
	"              color: \"#29324166\",\n" +
	"              padding: 0,\n" +
	"            }}\n" +
	"            checked={checked}\n" +
	"          />\n" +
	"        )}\n" +
	"        <p className=\"text-[#1A2636] text-[17px] font-semibold\">\n" +
	"          {artifactTitle} {no && no}\n" +
	"        </p>\n" +
	"      </div>\n" +
	"      <div\n" +
	"        className={`my-2 ${\n" +
	"          editMode && \"bg-blue-50 border-1 border-blue-100 p-3 rounded\"\n" +
	"        } `}\n" +
	"      >\n" +
	"        {!!url && !editMode ? (\n" +
	"          <Link href={url} target=\"_blank\" style={{ textDecoration: \"none\" }}>\n" +
	"            <span className=\"outline-none text-[#518AB9] font-semibold text-[17px] no-underline\">\n" +
	"              {title}\n" +
	"            </span>\n" +
	"          </Link>\n" +
	"        ) : typeof title === \"string\" ? (\n" +
	"          <p className=\"text-[#518AB9] font-semibold text-[17px]\">\n" +
	"            <span\n" +
	"              contentEditable={editMode}\n" +
	"              className=\"outline-none\"\n" +
	"              onBlur={(e) => onArtifactChange(\"title\", e.target.innerText)}\n" +
	"            >\n" +
	"              {title}\n" +
	"            </span>\n" +
	"          </p>\n" +
	"        ) : (\n" +
	"          title\n" +
	"        )}\n" +
	"\n" +
	"        <p>\n" +
	"          {!!repoName && (\n" +
	"            <span\n" +
	"              contentEditable={editMode}\n" +
	"              onBlur={(e) => onArtifactChange(\"repo_name\", e.target.innerText)}\n" +
	"              className=\"text-sm font-medium pr-4 outline-none\"\n" +
	"            >\n" +
	"              {repoName}\n" +
	"            </span>\n" +
	"          )}\n" +
	"          {!!updatedAt && (\n" +
	"            <span className=\"my-1 text-[#1A2636] text-xs italic\">\n" +
	"              Last updated: {updatedAt}\n" +
	"            </span>\n" +
	"          )}\n" +
	"        </p>\n" +
	"\n" +
	"        {message && (\n" +
	"          <div\n" +
	"            onBlur={(e) =>\n" +
	"              onArtifactChange(\"message\", editorRef.current?.getMarkdown())\n" +
	"            }\n" +
	"            className=\"text-sm text-[#1A2636] outline-none -m-3 \"\n" +
	"          >\n" +
	"            <MarkDownEditor\n" +
	"              editorRef={editorRef}\n" +
	"              markdown={message}\n" +
	"              readOnly={!editMode}\n" +
	"              hideToolbar={true}\n" +
	"            />\n" +
	"          </div>\n" +
	"        )}\n" +
	"        <div className=\"flex gap-4 flex-wrap items-center mt-2\">\n" +
	"          {tags.length > 0 &&\n" +
	"            tags.map((tag: any) => (\n" +
	"              <div\n" +
	"                key={tag}\n" +
	"                className=\"bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] \"\n" +
	"              >\n" +
	"                {tag}\n" +
	"              </div>\n" +
	"            ))}\n" +
	"        </div>\n" +
	"      </div>\n" +
	"    </div>\n" +
	"  );\n" +
	"};\n" +
	"\n" +
	"export const DesignDocumentBody = () => {\n" +
	"  const dispatch = useDispatch();\n" +
	"  const selectedDesignDoc = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,\n" +
	"  );\n" +
	"  return (\n" +
	"    <>\n" +
	"      <p className=\"text-[17px] font-semibold text-[#1A2636]\">\n" +
	"        Select Files from Google Drive\n" +
	"      </p>\n" +
	"      <div className=\"my-4\">\n" +
	"        {selectedDesignDoc.length > 0 &&\n" +
	"          selectedDesignDoc.map((doc: any) => (\n" +
	"            <div key={doc?.id} className=\"flex items-center gap-5\">\n" +
	"              <div className=\"h-5 w-5\">\n" +
	"                <img\n" +
	"                  src={doc?.iconUrl}\n" +
	"                  style={{ height: \"auto\", width: \"100%\" }}\n" +
	"                  alt={doc?.name}\n" +
	"                />\n" +
	"              </div>\n" +
	"              <div className=\"flex items-center w-full justify-between\">\n" +
	"                <div>\n" +
	"                  <p className=\"text-sm text-[#1A2636]\">{doc?.name}</p>\n" +
	"                  <a\n" +
	"                    className=\"text-sm text-[#518AB9]\"\n" +
	"                    target=\"_blank\"\n" +
	"                    href={doc?.url}\n" +
	"                  >\n" +
	"                    {doc?.url}\n" +
	"                  </a>\n" +
	"                </div>\n" +
	"                <IconButton\n" +
	"                  size=\"small\"\n" +
	"                  onClick={() =>\n" +
	"                    dispatch(\n" +
	"                      setSelectedDesignDoc(\n" +
	"                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),\n" +
	"                      ),\n" +
	"                    )\n" +
	"                  }\n" +
	"                >\n" +
	"                  <Close fontSize=\"small\" />\n" +
	"                </IconButton>\n" +
	"              </div>\n" +
	"            </div>\n" +
	"          ))}\n" +
	"      </div>\n" +
	"      <GoogleDrivePicker\n" +
	"        onPick={(data) => {\n" +
	"          const newDocs = data?.docs.filter(\n" +
	"            (doc: any) =>\n" +
	"              !selectedDesignDoc.some(\n" +
	"                (selectedDoc: any) => selectedDoc.id === doc.id,\n" +
	"              ),\n" +
	"          );\n" +
	"          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));\n" +
	"        }}\n" +
	"      />\n" +
	"    </>\n" +
	"  );\n" +
	"};\n" +
	"\n";


  export const newCode = "\"use client\";\n" +
	"import { setSelectedDesignDoc } from \"@/store/packageCreatorSlice\";\n" +
	"import { MDXEditorMethods } from \"@mdxeditor/editor\";\n" +
	"import Close from \"@mui/icons-material/Close\";\n" +
	"import { Checkbox, IconButton, Link } from \"@mui/material\";\n" +
	"import { useMemo, useRef } from \"react\";\n" +
	"import { useDispatch, useSelector } from \"react-redux\";\n" +
	"import MarkDownEditor from \"../ui/MarkDownEditor\";\n" +
	"import GoogleDrivePicker from \"./GoogleDrivePicker\";\n" +
	"\n" +
	"export const Strength = ({\n" +
	"  strengths,\n" +
	"  editMode = false,\n" +
	"  onDataChange = () => {},\n" +
	"}: {\n" +
	"  strengths: any[];\n" +
	"  editMode: boolean;\n" +
	"  onDataChange: any;\n" +
	"}) => (\n" +
	"  <div\n" +
	"    className={`w-full border-1 ${\n" +
	"      editMode ? \"bg-blue-50 border-blue-100\" : \"border-[#C9DBE9] \"\n" +
	"    } rounded-xl p-4`}\n" +
	"  >\n" +
	"    <p className=\"text-[17px] font-semibold text-[#1A2636]\">Strengths</p>\n" +
	"    <ul className=\"text-sm font-normal list-disc px-4\">\n" +
	"      {strengths?.map((str: any, index: number) => (\n" +
	"        <li key={str?.strength + index}>\n" +
	"          <span\n" +
	"            contentEditable={editMode}\n" +
	"            className=\"font-semibold outline-none\"\n" +
	"            onBlur={(e) =>\n" +
	"              editMode && onDataChange(index, \"strength\", e.target.innerText)\n" +
	"            }\n" +
	"          >\n" +
	"            {str?.strength}\n" +
	"          </span>\n" +
	"          :{\" \"}\n" +
	"          <span\n" +
	"            contentEditable={editMode}\n" +
	"            dangerouslySetInnerHTML={{ __html: str?.description }}\n" +
	"            className=\"outline-none\"\n" +
	"            onBlur={(e) =>\n" +
	"              editMode && onDataChange(index, \"description\", e.target.innerText)\n" +
	"            }\n" +
	"          ></span>\n" +
	"        </li>\n" +
	"      ))}\n" +
	"    </ul>\n" +
	"  </div>\n" +
	");\n" +
	"\n" +
	"export const Opportunity = ({\n" +
	"  opportunities,\n" +
	"  editMode = false,\n" +
	"  onDataChange = () => {},\n" +
	"}: {\n" +
	"  opportunities: any[];\n" +
	"  editMode: boolean;\n" +
	"  onDataChange: any;\n" +
	"}) => (\n" +
	"  <div\n" +
	"    className={`w-full border-1 ${\n" +
	"      editMode ? \"bg-blue-50 border-blue-100\" : \"border-[#C9DBE9] \"\n" +
	"    } rounded-xl p-4`}\n" +
	"  >\n" +
	"    <p className=\"text-[17px] font-semibold text-[#1A2636]\">Opportunities</p>\n" +
	"    <ul className=\"text-sm font-normal list-disc px-4\">\n" +
	"      {opportunities?.map((opp: any, index: number) => (\n" +
	"        <li key={opp?.opportunity + index}>\n" +
	"          <span\n" +
	"            contentEditable={editMode}\n" +
	"            className=\"font-semibold outline-none\"\n" +
	"            onBlur={(e) =>\n" +
	"              editMode && onDataChange(index, \"opportunity\", e.target.innerText)\n" +
	"            }\n" +
	"          >\n" +
	"            {opp?.opportunity}\n" +
	"          </span>\n" +
	"          :{\" \"}\n" +
	"          <span\n" +
	"            dangerouslySetInnerHTML={{ __html: opp?.description }}\n" +
	"            contentEditable={editMode}\n" +
	"            className=\"outline-none \"\n" +
	"            onBlur={(e) =>\n" +
	"              editMode && onDataChange(index, \"description\", e.target.innerText)\n" +
	"            }\n" +
	"          ></span>\n" +
	"        </li>\n" +
	"      ))}\n" +
	"    </ul>\n" +
	"  </div>\n" +
	");\n" +
	"\n" +
	"export const Artifact = ({\n" +
	"  viewOnly = false,\n" +
	"  tags = [],\n" +
	"  url = \"\",\n" +
	"  updatedAt = \"\",\n" +
	"  message = \"\",\n" +
	"  onCheck = () => {},\n" +
	"  checked = false,\n" +
	"  value,\n" +
	"  title = null,\n" +
	"  no = 0,\n" +
	"  artifactTitle = \"Artifact\",\n" +
	"  editMode = false,\n" +
	"  onArtifactChange = () => {},\n" +
	"  repoName = \"\",\n" +
	"  repoLink = \"\",\n" +
	"}: any) => {\n" +
	"  const editorRef = useRef<MDXEditorMethods>(null);\n" +
	"  useMemo(() => editorRef.current?.setMarkdown(message), [message]);\n" +
	"  return (\n" +
	"    <div className=\"my-2\">\n" +
	"      <div className=\"flex gap-2 items-center\">\n" +
	"        {!viewOnly && (\n" +
	"          <Checkbox\n" +
	"            value={value}\n" +
	"            onChange={() => onCheck(value)}\n" +
	"            sx={{\n" +
	"              \"&.Mui-checked\": {\n" +
	"                color: \"#4ED9EF\",\n" +
	"              },\n" +
	"              color: \"#29324166\",\n" +
	"              padding: 0,\n" +
	"            }}\n" +
	"            checked={checked}\n" +
	"          />\n" +
	"        )}\n" +
	"        <p className=\"text-[#1A2636] text-[17px] font-semibold\">\n" +
	"          {artifactTitle} {no && no}\n" +
	"        </p>\n" +
	"      </div>\n" +
	"      <div\n" +
	"        className={`my-2 ${\n" +
	"          editMode && \"bg-blue-50 border-1 border-blue-100 p-3 rounded\"\n" +
	"        } `}\n" +
	"      >\n" +
	"        {!!url && !editMode ? (\n" +
	"          <Link href={url} target=\"_blank\" style={{ textDecoration: \"none\" }}>\n" +
	"            <span className=\"outline-none text-[#518AB9] font-semibold text-[17px] no-underline\">\n" +
	"              {title}\n" +
	"            </span>\n" +
	"          </Link>\n" +
	"        ) : typeof title === \"string\" ? (\n" +
	"          <p className=\"text-[#518AB9] font-semibold text-[17px]\">\n" +
	"            <span\n" +
	"              contentEditable={editMode}\n" +
	"              className=\"outline-none\"\n" +
	"              onBlur={(e) =>\n" +
	"                editMode && onArtifactChange(\"title\", e.target.innerText)\n" +
	"              }\n" +
	"            >\n" +
	"              {title}\n" +
	"            </span>\n" +
	"          </p>\n" +
	"        ) : (\n" +
	"          title\n" +
	"        )}\n" +
	"\n" +
	"        <p>\n" +
	"          {!!repoName && (\n" +
	"            <Link\n" +
	"              target=\"_blank\"\n" +
	"              href={repoLink}\n" +
	"              style={{ textDecoration: \"none\" }}\n" +
	"            >\n" +
	"              <span\n" +
	"                contentEditable={editMode}\n" +
	"                onBlur={(e) =>\n" +
	"                  editMode && onArtifactChange(\"repo_name\", e.target.innerText)\n" +
	"                }\n" +
	"                className=\"text-sm font-medium pr-4 outline-none\"\n" +
	"              >\n" +
	"                {repoName}\n" +
	"              </span>\n" +
	"            </Link>\n" +
	"          )}\n" +
	"          {!!updatedAt && (\n" +
	"            <span className=\"my-1 text-[#1A2636] text-xs italic\">\n" +
	"              Last updated: {updatedAt}\n" +
	"            </span>\n" +
	"          )}\n" +
	"        </p>\n" +
	"\n" +
	"        {message && (\n" +
	"          <div\n" +
	"            onBlur={(e) =>\n" +
	"              editMode &&\n" +
	"              onArtifactChange(\"message\", editorRef.current?.getMarkdown())\n" +
	"            }\n" +
	"            className=\"text-sm text-[#1A2636] outline-none -m-3 \"\n" +
	"          >\n" +
	"            <MarkDownEditor\n" +
	"              editorRef={editorRef}\n" +
	"              markdown={message}\n" +
	"              readOnly={!editMode}\n" +
	"              hideToolbar={true}\n" +
	"            />\n" +
	"          </div>\n" +
	"        )}\n" +
	"        <div className=\"flex gap-4 flex-wrap items-center mt-2\">\n" +
	"          {tags.length > 0 &&\n" +
	"            tags.map((tag: any) => (\n" +
	"              <div\n" +
	"                key={tag}\n" +
	"                className=\"bg-[#C9DBE9] w-fit px-2 py-1 rounded-2xl text-[10px] text-[#1A2636] \"\n" +
	"              >\n" +
	"                {tag}\n" +
	"              </div>\n" +
	"            ))}\n" +
	"        </div>\n" +
	"      </div>\n" +
	"    </div>\n" +
	"  );\n" +
	"};\n" +
	"\n" +
	"export const DesignDocumentBody = () => {\n" +
	"  const dispatch = useDispatch();\n" +
	"  const selectedDesignDoc = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.selectedDesignDoc,\n" +
	"  );\n" +
	"  return (\n" +
	"    <>\n" +
	"      <p className=\"text-[17px] font-semibold text-[#1A2636]\">\n" +
	"        Select Files from Google Drive\n" +
	"      </p>\n" +
	"      <div className=\"my-4\">\n" +
	"        {selectedDesignDoc.length > 0 &&\n" +
	"          selectedDesignDoc.map((doc: any) => (\n" +
	"            <div key={doc?.id} className=\"flex items-center gap-5\">\n" +
	"              <div className=\"h-5 w-5\">\n" +
	"                <img\n" +
	"                  src={doc?.iconUrl}\n" +
	"                  style={{ height: \"auto\", width: \"100%\" }}\n" +
	"                  alt={doc?.name}\n" +
	"                />\n" +
	"              </div>\n" +
	"              <div className=\"flex items-center w-full justify-between\">\n" +
	"                <div>\n" +
	"                  <p className=\"text-sm text-[#1A2636]\">{doc?.name}</p>\n" +
	"                  <a\n" +
	"                    className=\"text-sm text-[#518AB9]\"\n" +
	"                    target=\"_blank\"\n" +
	"                    href={doc?.url}\n" +
	"                  >\n" +
	"                    {doc?.url}\n" +
	"                  </a>\n" +
	"                </div>\n" +
	"                <IconButton\n" +
	"                  size=\"small\"\n" +
	"                  onClick={() =>\n" +
	"                    dispatch(\n" +
	"                      setSelectedDesignDoc(\n" +
	"                        selectedDesignDoc.filter((i: any) => i?.id !== doc?.id),\n" +
	"                      ),\n" +
	"                    )\n" +
	"                  }\n" +
	"                >\n" +
	"                  <Close fontSize=\"small\" />\n" +
	"                </IconButton>\n" +
	"              </div>\n" +
	"            </div>\n" +
	"          ))}\n" +
	"      </div>\n" +
	"      <GoogleDrivePicker\n" +
	"        onPick={(data) => {\n" +
	"          const newDocs = data?.docs.filter(\n" +
	"            (doc: any) =>\n" +
	"              !selectedDesignDoc.some(\n" +
	"                (selectedDoc: any) => selectedDoc.id === doc.id,\n" +
	"              ),\n" +
	"          );\n" +
	"          dispatch(setSelectedDesignDoc([...selectedDesignDoc, ...newDocs]));\n" +
	"        }}\n" +
	"      />\n" +
	"    </>\n" +
	"  );\n" +
	"};\n" +
	"\n";