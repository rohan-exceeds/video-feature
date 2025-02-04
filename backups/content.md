## !!steps One

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
// !focus(1:1)
// !block(1:1) 0,3,red
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```


## !!steps Two

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
        // !focus(1:1)
// !block(1:1) 0,3,red
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```


## !!steps Three

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
// !focus(1:1)
// !block(1:1) 0,3,red
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```


## !!steps Four

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
// !focus(1:3)
// !block(1:3) 0,3,red
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```



## !!steps Five

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
// !focus(1:18)
// !block(1:18) 0,3,red
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```



## !!steps Six

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    {/* !focus(1:13) */}
{/* !block(1:13) 0,3,red */}
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```

## !!steps Seven

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                    {/* !focus(1:1) */}
{/* !block(1:1) 0,3,red */}
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```

## !!steps Eight

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                // !focus(1:6)
// !block(1:6) 0,3,red
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```

## !!steps Nine

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? overallEvaluation?.summary
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={overallEvaluation?.evaluation?.strengths}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={overallEvaluation?.evaluation?.opportunities}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {
          return !evaluations?.length ? (
            []
          ) : (
            <div key={evaluations[0]?.hash}>
              <Artifact
                editMode={editMode}
                tags={evaluations[0]?.tags}
                message={evaluations[0]?.artifact_summary_string}
                value={evaluations[0]?.hash}
                repoName={evaluations[0]?.repo_name}
                title={
                  <span className="text-[#518AB9] font-semibold text-[17px]">
                    Commit{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(index, "hash", e.target.innerText)
                      }
                    >
                      {evaluations[0]?.hash?.slice(0, 7)}
                    </span>
                    :{" "}
                    <span
                      contentEditable={editMode}
                      className="outline-none"
                      onBlur={(e) =>
                        onArtifactChange(
                          index,
                          "commit_title",
                          e.target.innerText,
                        )
                      }
                    >
                      {evaluations[0]?.commit_title}
                    </span>
                  </span>
                }
                viewOnly={
                  IS_WAYFAIR
                    ? true
                    : pathname?.includes("/package-creator")
                    ? !expanded
                    : true
                }
                // !focus(1:11)
// !block(1:11) 0,3,red
                checked={selectedCommits?.includes(evaluations[0]?.hash)}
                onCheck={handleCommitCheck}
                no={index + 1}
                url={evaluations[0]?.hash_url}
                updatedAt={evaluations[0]?.committed_at}
                onArtifactChange={(key: string, value: string) =>
                  onArtifactChange(
                    index,
                    key === "message" ? "artifact_summary_string" : key,
                    value,
                  )
                }
              />
              {index !== codeEvaluation?.length - 1 && (
                <Divider sx={{ margin: "20px 0px" }} />
              )}
            </div>
          );
        })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```




## !!steps Eleven

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );
// !focus(1:5)
// !block(1:5) 0,3,teal
  const replaceHashWithURL = (opportunities: any) => {
    let evalObj: any = {};
    codeEvaluation.forEach(({ evaluations }: any) => {
      evalObj[evaluations[0]?.hash] = evaluations[0]?.hash_url;
    });

    if (typeof opportunities === "string") {
      Object.keys(evalObj).forEach((key) => {
        if (opportunities?.includes(key.slice(0, 7))) {
          opportunities = opportunities.replace(
            key.slice(0, 7),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        } else if (opportunities?.includes(key.slice(0, 6))) {
          opportunities = opportunities.replace(
            key.slice(0, 6),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        }
      });

      return opportunities;
    }

    const newOpp = opportunities?.map((opp: any) => {
      let updatedDescription = opp?.description;

      Object.keys(evalObj).forEach((key) => {
        if (updatedDescription?.includes(key.slice(0, 7))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 7),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        } else if (updatedDescription?.includes(key.slice(0, 6))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 6),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        }
      });

      return {
        ...opp,
        description: updatedDescription,
      };
    });
    return newOpp;
  };

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? replaceHashWithURL(overallEvaluation?.summary)
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={replaceHashWithURL(
            overallEvaluation?.evaluation?.strengths,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={replaceHashWithURL(
            overallEvaluation?.evaluation?.opportunities,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation
          .flatMap((i: any, mainIndex: number) =>
            !i.evaluations?.length ? [] : { ...i, mainIndex },
          )
          ?.map(({ evaluations, mainIndex }: any, index: any) => {
            return (
              <div key={evaluations[0]?.hash}>
                <Artifact
                  editMode={editMode}
                  tags={evaluations[0]?.tags}
                  message={evaluations[0]?.artifact_summary_string}
                  value={evaluations[0]?.hash}
                  repoName={evaluations[0]?.repo_name}
                  title={
                    <span className="text-[#518AB9] font-semibold text-[17px]">
                      Commit{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "hash",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.hash?.slice(0, 7)}
                      </span>
                      :{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "commit_title",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.commit_title}
                      </span>
                    </span>
                  }
                  viewOnly={
                    IS_WAYFAIR
                      ? true
                      : pathname?.includes("/package-creator")
                      ? !expanded
                      : true
                  }
                  checked={selectedCommits?.includes(evaluations[0]?.hash)}
                  onCheck={handleCommitCheck}
                  no={index + 1}
                  url={evaluations[0]?.hash_url}
                  repoLink={evaluations[0]?.hash_url?.split("/commit")[0]}
                  updatedAt={evaluations[0]?.committed_at}
                  onArtifactChange={(key: string, value: string) =>
                    onArtifactChange(
                      mainIndex,
                      key === "message" ? "artifact_summary_string" : key,
                      value,
                    )
                  }
                />
                {index !== codeEvaluation?.length - 1 && (
                  <Divider sx={{ margin: "20px 0px" }} />
                )}
              </div>
            );
          })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```


## !!steps Twelve

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  const replaceHashWithURL = (opportunities: any) => {
    let evalObj: any = {};
    codeEvaluation.forEach(({ evaluations }: any) => {
      evalObj[evaluations[0]?.hash] = evaluations[0]?.hash_url;
    });
// !focus(1:6)
// !block(1:6) 0,3,teal
    if (typeof opportunities === "string") {
      Object.keys(evalObj).forEach((key) => {
        if (opportunities?.includes(key.slice(0, 7))) {
          opportunities = opportunities.replace(
            key.slice(0, 7),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        } else if (opportunities?.includes(key.slice(0, 6))) {
          opportunities = opportunities.replace(
            key.slice(0, 6),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        }
      });

      return opportunities;
    }

    const newOpp = opportunities?.map((opp: any) => {
      let updatedDescription = opp?.description;

      Object.keys(evalObj).forEach((key) => {
        if (updatedDescription?.includes(key.slice(0, 7))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 7),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        } else if (updatedDescription?.includes(key.slice(0, 6))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 6),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        }
      });

      return {
        ...opp,
        description: updatedDescription,
      };
    });
    return newOpp;
  };

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? replaceHashWithURL(overallEvaluation?.summary)
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={replaceHashWithURL(
            overallEvaluation?.evaluation?.strengths,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={replaceHashWithURL(
            overallEvaluation?.evaluation?.opportunities,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation
          .flatMap((i: any, mainIndex: number) =>
            !i.evaluations?.length ? [] : { ...i, mainIndex },
          )
          ?.map(({ evaluations, mainIndex }: any, index: any) => {
            return (
              <div key={evaluations[0]?.hash}>
                <Artifact
                  editMode={editMode}
                  tags={evaluations[0]?.tags}
                  message={evaluations[0]?.artifact_summary_string}
                  value={evaluations[0]?.hash}
                  repoName={evaluations[0]?.repo_name}
                  title={
                    <span className="text-[#518AB9] font-semibold text-[17px]">
                      Commit{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "hash",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.hash?.slice(0, 7)}
                      </span>
                      :{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "commit_title",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.commit_title}
                      </span>
                    </span>
                  }
                  viewOnly={
                    IS_WAYFAIR
                      ? true
                      : pathname?.includes("/package-creator")
                      ? !expanded
                      : true
                  }
                  checked={selectedCommits?.includes(evaluations[0]?.hash)}
                  onCheck={handleCommitCheck}
                  no={index + 1}
                  url={evaluations[0]?.hash_url}
                  repoLink={evaluations[0]?.hash_url?.split("/commit")[0]}
                  updatedAt={evaluations[0]?.committed_at}
                  onArtifactChange={(key: string, value: string) =>
                    onArtifactChange(
                      mainIndex,
                      key === "message" ? "artifact_summary_string" : key,
                      value,
                    )
                  }
                />
                {index !== codeEvaluation?.length - 1 && (
                  <Divider sx={{ margin: "20px 0px" }} />
                )}
              </div>
            );
          })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```

## !!steps Thirteen

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  const replaceHashWithURL = (opportunities: any) => {
    let evalObj: any = {};
    codeEvaluation.forEach(({ evaluations }: any) => {
      evalObj[evaluations[0]?.hash] = evaluations[0]?.hash_url;
    });

    if (typeof opportunities === "string") {
      Object.keys(evalObj).forEach((key) => {
        if (opportunities?.includes(key.slice(0, 7))) {
          opportunities = opportunities.replace(
            key.slice(0, 7),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
          // !focus(1:4)
// !block(1:4) 0,3,teal
        } else if (opportunities?.includes(key.slice(0, 6))) {
          opportunities = opportunities.replace(
            key.slice(0, 6),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        }
      });

      return opportunities;
    }

    const newOpp = opportunities?.map((opp: any) => {
      let updatedDescription = opp?.description;

      Object.keys(evalObj).forEach((key) => {
        if (updatedDescription?.includes(key.slice(0, 7))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 7),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        } else if (updatedDescription?.includes(key.slice(0, 6))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 6),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        }
      });

      return {
        ...opp,
        description: updatedDescription,
      };
    });
    return newOpp;
  };

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? replaceHashWithURL(overallEvaluation?.summary)
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={replaceHashWithURL(
            overallEvaluation?.evaluation?.strengths,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={replaceHashWithURL(
            overallEvaluation?.evaluation?.opportunities,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation
          .flatMap((i: any, mainIndex: number) =>
            !i.evaluations?.length ? [] : { ...i, mainIndex },
          )
          ?.map(({ evaluations, mainIndex }: any, index: any) => {
            return (
              <div key={evaluations[0]?.hash}>
                <Artifact
                  editMode={editMode}
                  tags={evaluations[0]?.tags}
                  message={evaluations[0]?.artifact_summary_string}
                  value={evaluations[0]?.hash}
                  repoName={evaluations[0]?.repo_name}
                  title={
                    <span className="text-[#518AB9] font-semibold text-[17px]">
                      Commit{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "hash",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.hash?.slice(0, 7)}
                      </span>
                      :{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "commit_title",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.commit_title}
                      </span>
                    </span>
                  }
                  viewOnly={
                    IS_WAYFAIR
                      ? true
                      : pathname?.includes("/package-creator")
                      ? !expanded
                      : true
                  }
                  checked={selectedCommits?.includes(evaluations[0]?.hash)}
                  onCheck={handleCommitCheck}
                  no={index + 1}
                  url={evaluations[0]?.hash_url}
                  repoLink={evaluations[0]?.hash_url?.split("/commit")[0]}
                  updatedAt={evaluations[0]?.committed_at}
                  onArtifactChange={(key: string, value: string) =>
                    onArtifactChange(
                      mainIndex,
                      key === "message" ? "artifact_summary_string" : key,
                      value,
                    )
                  }
                />
                {index !== codeEvaluation?.length - 1 && (
                  <Divider sx={{ margin: "20px 0px" }} />
                )}
              </div>
            );
          })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```

## !!steps Fourteen

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  const replaceHashWithURL = (opportunities: any) => {
    let evalObj: any = {};
    codeEvaluation.forEach(({ evaluations }: any) => {
      evalObj[evaluations[0]?.hash] = evaluations[0]?.hash_url;
    });

    if (typeof opportunities === "string") {
      Object.keys(evalObj).forEach((key) => {
        if (opportunities?.includes(key.slice(0, 7))) {
          opportunities = opportunities.replace(
            key.slice(0, 7),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        } else if (opportunities?.includes(key.slice(0, 6))) {
          opportunities = opportunities.replace(
            key.slice(0, 6),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        }
      });

      return opportunities;
    }

    const newOpp = opportunities?.map((opp: any) => {
      let updatedDescription = opp?.description;
// !focus(1:7)
// !block(1:7) 0,3,teal
      Object.keys(evalObj).forEach((key) => {
        if (updatedDescription?.includes(key.slice(0, 7))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 7),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        } else if (updatedDescription?.includes(key.slice(0, 6))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 6),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        }
      });

      return {
        ...opp,
        description: updatedDescription,
      };
    });
    return newOpp;
  };

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? replaceHashWithURL(overallEvaluation?.summary)
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={replaceHashWithURL(
            overallEvaluation?.evaluation?.strengths,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={replaceHashWithURL(
            overallEvaluation?.evaluation?.opportunities,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
        codeEvaluation
          .flatMap((i: any, mainIndex: number) =>
            !i.evaluations?.length ? [] : { ...i, mainIndex },
          )
          ?.map(({ evaluations, mainIndex }: any, index: any) => {
            return (
              <div key={evaluations[0]?.hash}>
                <Artifact
                  editMode={editMode}
                  tags={evaluations[0]?.tags}
                  message={evaluations[0]?.artifact_summary_string}
                  value={evaluations[0]?.hash}
                  repoName={evaluations[0]?.repo_name}
                  title={
                    <span className="text-[#518AB9] font-semibold text-[17px]">
                      Commit{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "hash",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.hash?.slice(0, 7)}
                      </span>
                      :{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "commit_title",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.commit_title}
                      </span>
                    </span>
                  }
                  viewOnly={
                    IS_WAYFAIR
                      ? true
                      : pathname?.includes("/package-creator")
                      ? !expanded
                      : true
                  }
                  checked={selectedCommits?.includes(evaluations[0]?.hash)}
                  onCheck={handleCommitCheck}
                  no={index + 1}
                  url={evaluations[0]?.hash_url}
                  repoLink={evaluations[0]?.hash_url?.split("/commit")[0]}
                  updatedAt={evaluations[0]?.committed_at}
                  onArtifactChange={(key: string, value: string) =>
                    onArtifactChange(
                      mainIndex,
                      key === "message" ? "artifact_summary_string" : key,
                      value,
                    )
                  }
                />
                {index !== codeEvaluation?.length - 1 && (
                  <Divider sx={{ margin: "20px 0px" }} />
                )}
              </div>
            );
          })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```

## !!steps Fifteen

!duration 200

```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx
import { useFetchCodeCommits } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { areArraysSimilar } from "@/store/generalSlice";
import {
  setPackagingResult,
  setSelectedCommitsForRepos,
} from "@/store/packageCreatorSlice";
import { combineEvaluations } from "@/utils/generalFunctions";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Add from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { CodeIcon } from "../ui/Icons";
import ContributionSkeleton from "../ui/loaders/ContributionSkeleton";
import MarkDownEditor from "../ui/MarkDownEditor";
import { AllCommits } from "./CommitsTable";
import DraftAccordion from "./DraftAccordion";
import { Artifact, Opportunity, Strength } from "./DraftComponents";

const Output = ({
  expanded,
  codeReview,
  editMode,
  overallEvaluationSummary,
}: {
  expanded: boolean;
  codeReview: any;
  editMode: boolean;
  overallEvaluationSummary: any;
}) => {
  const auth = useAuth();
  const { IS_WAYFAIR } = auth;
  const [showAddMore, setShowAddMore] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user_id");
  const editorRef = useRef<MDXEditorMethods>(null);
  const selectedRepos: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedRepos,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const codeCommitsQuery = useFetchCodeCommits({
    enabled: false,
    queryKey: [userId, [selectedRepos]],
    params: {
      filter: JSON.stringify({
        employee_id: userId,
        repo_id: selectedRepos,
        selected_commits: selectedCommits,
      }),
      sort: JSON.stringify({ sortDir: "desc" }),
    },
  });
  const codeEvaluation = !pathname?.includes("/package-creator")
    ? codeReview
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.code_evaluation;

  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const overallEvaluation = !pathname?.includes("/package-creator")
    ? overallEvaluationSummary
    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)
        ?.overall_evaluation?.code_evaluation;

  const onDataChange = (
    type: "opportunities" | "strengths",
    listIndex: number,
    key: string,
    value: string,
  ) => {
    const updatedData = {
      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,
      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[
        type
      ].map((listData: any, lI: number) =>
        lI === listIndex ? { ...listData, [key]: value } : listData,
      ),
    };

    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            evaluation: updatedData,
          },
        },
      }),
    );
  };
  const onArtifactChange = (mainIndex: number, key: string, value: string) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        code_evaluation: packagingResult?.code_evaluation?.map(
          (ev: any, mI: number) =>
            mI === mainIndex
              ? {
                  ...ev,
                  evaluations: [
                    {
                      ...ev?.evaluations[0],
                      [key]: value,
                    },
                  ],
                }
              : ev,
        ),
      }),
    );
  };

  useEffect(() => {
    if (
      codeEvaluation?.length > 0 &&
      selectedCommits?.length === 0 &&
      pathname?.includes("/package-creator") &&
      !IS_WAYFAIR
    ) {
      dispatch(
        setSelectedCommitsForRepos(
          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),
        ),
      );
    }
  }, [codeEvaluation]);

  const handleSummaryChange = (e: any) => {
    dispatch(
      setPackagingResult({
        ...packagingResult,
        overall_evaluation: {
          ...packagingResult?.overall_evaluation,
          code_evaluation: {
            ...packagingResult?.overall_evaluation?.code_evaluation,
            summary: editorRef.current?.getMarkdown(),
          },
        },
      }),
    );
  };

  const handleCommitCheck = (value: string) => {
    dispatch(
      setSelectedCommitsForRepos(
        selectedCommits?.includes(value)
          ? selectedCommits?.filter((v: string) => v !== value)
          : [...selectedCommits, value],
      ),
    );
  };

  useMemo(
    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),
    [overallEvaluation?.summary],
  );

  const replaceHashWithURL = (opportunities: any) => {
    let evalObj: any = {};
    codeEvaluation.forEach(({ evaluations }: any) => {
      evalObj[evaluations[0]?.hash] = evaluations[0]?.hash_url;
    });

    if (typeof opportunities === "string") {
      Object.keys(evalObj).forEach((key) => {
        if (opportunities?.includes(key.slice(0, 7))) {
          opportunities = opportunities.replace(
            key.slice(0, 7),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        } else if (opportunities?.includes(key.slice(0, 6))) {
          opportunities = opportunities.replace(
            key.slice(0, 6),
            `[${key.slice(0, 7)}](${evalObj[key]})`,
          );
        }
      });

      return opportunities;
    }


    const newOpp = opportunities?.map((opp: any) => {
      let updatedDescription = opp?.description;

      Object.keys(evalObj).forEach((key) => {
        if (updatedDescription?.includes(key.slice(0, 7))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 7),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        } else if (updatedDescription?.includes(key.slice(0, 6))) {
          updatedDescription = updatedDescription.replace(
            key.slice(0, 6),
            `<a target="_blank" contenteditable="false" style="cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;" href=${
              evalObj[key]
            }>${key.slice(0, 7)}</a>`,
          );
        }
      });

      return {
        ...opp,
        description: updatedDescription,
      };
    });
    return newOpp;
  };

  return (
    <div>
      <div
        className={`text-sm text-[#1A2636] p-1 ${
          editMode
            ? "rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none"
            : " border-1 rounded-xl"
        } `}
        onBlur={handleSummaryChange}
      >
        <MarkDownEditor
          editorRef={editorRef}
          markdown={
            overallEvaluation?.summary?.length > 0
              ? replaceHashWithURL(overallEvaluation?.summary)
              : "No summary found"
          }
          readOnly={!editMode}
          hideToolbar={true}
        />
      </div>

      <div
        className={`flex ${
          !pathname?.includes("/package-creator")
            ? "flex-wrap"
            : "items-stretch"
        }  justify-between gap-4 my-4`}
      >
        <Strength
          strengths={replaceHashWithURL(
            overallEvaluation?.evaluation?.strengths,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("strengths", index, k, v)
          }
        />
        <Opportunity
          opportunities={replaceHashWithURL(
            overallEvaluation?.evaluation?.opportunities,
          )}
          editMode={editMode}
          onDataChange={(index: number, k: string, v: string) =>
            onDataChange("opportunities", index, k, v)
          }
        />
      </div>
      {codeEvaluation?.length > 0 &&
      // !focus(1:25)
// !block(1:25) 0,3,teal
        codeEvaluation
          .flatMap((i: any, mainIndex: number) =>
            !i.evaluations?.length ? [] : { ...i, mainIndex },
          )
          ?.map(({ evaluations, mainIndex }: any, index: any) => {
            return (
              <div key={evaluations[0]?.hash}>
                <Artifact
                  editMode={editMode}
                  tags={evaluations[0]?.tags}
                  message={evaluations[0]?.artifact_summary_string}
                  value={evaluations[0]?.hash}
                  repoName={evaluations[0]?.repo_name}
                  title={
                    <span className="text-[#518AB9] font-semibold text-[17px]">
                      Commit{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "hash",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.hash?.slice(0, 7)}
                      </span>
                      :{" "}
                      <span
                        contentEditable={editMode}
                        className="outline-none"
                        onBlur={(e) =>
                          onArtifactChange(
                            mainIndex,
                            "commit_title",
                            e.target.innerText,
                          )
                        }
                      >
                        {evaluations[0]?.commit_title}
                      </span>
                    </span>
                  }
                  viewOnly={
                    IS_WAYFAIR
                      ? true
                      : pathname?.includes("/package-creator")
                      ? !expanded
                      : true
                  }
                  checked={selectedCommits?.includes(evaluations[0]?.hash)}
                  onCheck={handleCommitCheck}
                  no={index + 1}
                  url={evaluations[0]?.hash_url}
                  repoLink={evaluations[0]?.hash_url?.split("/commit")[0]}
                  updatedAt={evaluations[0]?.committed_at}
                  onArtifactChange={(key: string, value: string) =>
                    onArtifactChange(
                      mainIndex,
                      key === "message" ? "artifact_summary_string" : key,
                      value,
                    )
                  }
                />
                {index !== codeEvaluation?.length - 1 && (
                  <Divider sx={{ margin: "20px 0px" }} />
                )}
              </div>
            );
          })}

      {expanded && pathname?.includes("/package-creator") && (
        <>
          {!showAddMore && !IS_WAYFAIR ? (
            <Button
              variant="text"
              sx={{ mt: 2, textDecoration: "underline" }}
              onClick={() => {
                codeCommitsQuery.refetch();
                setShowAddMore(true);
              }}
              startIcon={<Add />}
            >
              Add more artifacts
            </Button>
          ) : (
            <div className="mt-6">
              {" "}
              <AllCommits />
            </div>
          )}
          {showAddMore && !IS_WAYFAIR && (
            <>
              <div className="border-2 w-full border-[#C9DBE9] my-4"></div>
              <div>
                <p className="text-[17px] font-semibold text-[#1A2636] ">
                  Add more artifacts:
                </p>
                <p className="text-[#1A2636] text-sm ">
                  Select from below list or upload more artifacts using URL
                  links.
                </p>
              </div>
              {codeCommitsQuery.data?.length && (
                <div className="max-h-[400px] overflow-auto my-4 ">
                  {codeCommitsQuery.data?.map((commit: any, index: number) => (
                    <Fragment key={commit?.id}>
                      <Artifact
                        url={commit?.url}
                        updatedAt={moment(commit?.committed_at).format(
                          "MM/DD/YYYY, hh:mmA",
                        )}
                        message={commit?.commit_message}
                        checked={selectedCommits?.includes(commit?.commit_sha)}
                        value={commit?.commit_sha}
                        onCheck={handleCommitCheck}
                        repoName={commit?.repo_name || ""}
                        no={
                          !!codeEvaluation?.artifacts?.length
                            ? codeEvaluation?.artifacts?.length + index + 1
                            : index + 1
                        }
                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${
                          commit?.commit_message
                        }`}
                      />
                      {index !== codeCommitsQuery.data?.length - 1 && (
                        <Divider />
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
              {codeCommitsQuery.isFetching && <ContributionSkeleton />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CodeContributionDraft = ({
  codeReview = null,
  overallEvaluationSummary = null,
  editMode = false,
  onRetry = () => {},
}: {
  codeReview?: any[] | null;
  overallEvaluationSummary?: any[] | null;
  editMode?: boolean;
  onRetry?: Function;
}) => {
  const packagingResult = useSelector(
    (state: any) => state?.packageCreatorSlice?.packagingResult,
  );
  const stalePackageIds = useSelector(
    (state: any) => state?.packageCreatorSlice?.stalePackageIds,
  );
  const selectedCommits: string[] = useSelector(
    (state: any) => state.packageCreatorSlice?.selectedCommits,
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <DraftAccordion
        icon={<CodeIcon />}
        title="Code Contribution"
        collapsedBody={
          <Output
            editMode={editMode}
            expanded={false}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        expandedBody={
          <Output
            editMode={editMode}
            expanded={true}
            codeReview={codeReview}
            overallEvaluationSummary={overallEvaluationSummary}
          />
        }
        copyText={{
          artifacts: combineEvaluations(packagingResult?.code_evaluation)
            ?.artifacts,
          ...packagingResult?.overall_evaluation?.code_evaluation,
        }}
        onRetry={() => {
          onRetry({
            status: "draft",
            isRegenerate: true,
            regenerate_section: "code_evaluation",
            setLoading: (b: boolean) => setLoading(b),
          });
        }}
        isRetrying={loading}
        disableRegenerate={areArraysSimilar(
          selectedCommits,
          stalePackageIds?.selectedCommits,
        )}
      />
    </div>
  );
};

export default CodeContributionDraft;
```