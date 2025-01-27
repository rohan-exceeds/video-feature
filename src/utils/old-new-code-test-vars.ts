export const oldCode = "import { useFetchCodeCommits } from \"@/hooks/useApi\";\n" +
	"import useAuth from \"@/hooks/useAuth\";\n" +
	"import { areArraysSimilar } from \"@/store/generalSlice\";\n" +
	"import {\n" +
	"  setPackagingResult,\n" +
	"  setSelectedCommitsForRepos,\n" +
	"} from \"@/store/packageCreatorSlice\";\n" +
	"import { combineEvaluations } from \"@/utils/generalFunctions\";\n" +
	"import { MDXEditorMethods } from \"@mdxeditor/editor\";\n" +
	"import Add from \"@mui/icons-material/Add\";\n" +
	"import { Divider } from \"@mui/material\";\n" +
	"import moment from \"moment\";\n" +
	"import { usePathname, useSearchParams } from \"next/navigation\";\n" +
	"import { Fragment, useEffect, useMemo, useRef, useState } from \"react\";\n" +
	"import { useDispatch, useSelector } from \"react-redux\";\n" +
	"import Button from \"../ui/Button\";\n" +
	"import { CodeIcon } from \"../ui/Icons\";\n" +
	"import ContributionSkeleton from \"../ui/loaders/ContributionSkeleton\";\n" +
	"import MarkDownEditor from \"../ui/MarkDownEditor\";\n" +
	"import { AllCommits } from \"./CommitsTable\";\n" +
	"import DraftAccordion from \"./DraftAccordion\";\n" +
	"import { Artifact, Opportunity, Strength } from \"./DraftComponents\";\n" +
	"\n" +
	"const Output = ({\n" +
	"  expanded,\n" +
	"  codeReview,\n" +
	"  editMode,\n" +
	"  overallEvaluationSummary,\n" +
	"}: {\n" +
	"  expanded: boolean;\n" +
	"  codeReview: any;\n" +
	"  editMode: boolean;\n" +
	"  overallEvaluationSummary: any;\n" +
	"}) => {\n" +
	"  const auth = useAuth();\n" +
	"  const { IS_WAYFAIR } = auth;\n" +
	"  const [showAddMore, setShowAddMore] = useState(false);\n" +
	"  const searchParams = useSearchParams();\n" +
	"  const userId = searchParams?.get(\"user_id\");\n" +
	"  const editorRef = useRef<MDXEditorMethods>(null);\n" +
	"  const selectedRepos: string[] = useSelector(\n" +
	"    (state: any) => state.packageCreatorSlice?.selectedRepos,\n" +
	"  );\n" +
	"  const selectedCommits: string[] = useSelector(\n" +
	"    (state: any) => state.packageCreatorSlice?.selectedCommits,\n" +
	"  );\n" +
	"  const pathname = usePathname();\n" +
	"  const dispatch = useDispatch();\n" +
	"  const codeCommitsQuery = useFetchCodeCommits({\n" +
	"    enabled: false,\n" +
	"    queryKey: [userId, [selectedRepos]],\n" +
	"    params: {\n" +
	"      filter: JSON.stringify({\n" +
	"        employee_id: userId,\n" +
	"        repo_id: selectedRepos,\n" +
	"        selected_commits: selectedCommits,\n" +
	"      }),\n" +
	"      sort: JSON.stringify({ sortDir: \"desc\" }),\n" +
	"    },\n" +
	"  });\n" +
	"  const codeEvaluation = !pathname?.includes(\"/package-creator\")\n" +
	"    ? codeReview\n" +
	"    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)\n" +
	"        ?.code_evaluation;\n" +
	"\n" +
	"  const packagingResult = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.packagingResult,\n" +
	"  );\n" +
	"  const overallEvaluation = !pathname?.includes(\"/package-creator\")\n" +
	"    ? overallEvaluationSummary\n" +
	"    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)\n" +
	"        ?.overall_evaluation?.code_evaluation;\n" +
	"\n" +
	"  const onDataChange = (\n" +
	"    type: \"opportunities\" | \"strengths\",\n" +
	"    listIndex: number,\n" +
	"    key: string,\n" +
	"    value: string,\n" +
	"  ) => {\n" +
	"    const updatedData = {\n" +
	"      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,\n" +
	"      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[\n" +
	"        type\n" +
	"      ].map((listData: any, lI: number) =>\n" +
	"        lI === listIndex ? { ...listData, [key]: value } : listData,\n" +
	"      ),\n" +
	"    };\n" +
	"\n" +
	"    dispatch(\n" +
	"      setPackagingResult({\n" +
	"        ...packagingResult,\n" +
	"        overall_evaluation: {\n" +
	"          ...packagingResult?.overall_evaluation,\n" +
	"          code_evaluation: {\n" +
	"            ...packagingResult?.overall_evaluation?.code_evaluation,\n" +
	"            evaluation: updatedData,\n" +
	"          },\n" +
	"        },\n" +
	"      }),\n" +
	"    );\n" +
	"  };\n" +
	"  const onArtifactChange = (mainIndex: number, key: string, value: string) => {\n" +
	"    dispatch(\n" +
	"      setPackagingResult({\n" +
	"        ...packagingResult,\n" +
	"        code_evaluation: packagingResult?.code_evaluation?.map(\n" +
	"          (ev: any, mI: number) =>\n" +
	"            mI === mainIndex\n" +
	"              ? {\n" +
	"                  ...ev,\n" +
	"                  evaluations: [\n" +
	"                    {\n" +
	"                      ...ev?.evaluations[0],\n" +
	"                      [key]: value,\n" +
	"                    },\n" +
	"                  ],\n" +
	"                }\n" +
	"              : ev,\n" +
	"        ),\n" +
	"      }),\n" +
	"    );\n" +
	"  };\n" +
	"\n" +
	"  useEffect(() => {\n" +
	"    if (\n" +
	"      codeEvaluation?.length > 0 &&\n" +
	"      selectedCommits?.length === 0 &&\n" +
	"      pathname?.includes(\"/package-creator\") &&\n" +
	"      !IS_WAYFAIR\n" +
	"    ) {\n" +
	"      dispatch(\n" +
	"        setSelectedCommitsForRepos(\n" +
	"          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),\n" +
	"        ),\n" +
	"      );\n" +
	"    }\n" +
	"  }, [codeEvaluation]);\n" +
	"\n" +
	"  const handleSummaryChange = (e: any) => {\n" +
	"    dispatch(\n" +
	"      setPackagingResult({\n" +
	"        ...packagingResult,\n" +
	"        overall_evaluation: {\n" +
	"          ...packagingResult?.overall_evaluation,\n" +
	"          code_evaluation: {\n" +
	"            ...packagingResult?.overall_evaluation?.code_evaluation,\n" +
	"            summary: editorRef.current?.getMarkdown(),\n" +
	"          },\n" +
	"        },\n" +
	"      }),\n" +
	"    );\n" +
	"  };\n" +
	"\n" +
	"  const handleCommitCheck = (value: string) => {\n" +
	"    dispatch(\n" +
	"      setSelectedCommitsForRepos(\n" +
	"        selectedCommits?.includes(value)\n" +
	"          ? selectedCommits?.filter((v: string) => v !== value)\n" +
	"          : [...selectedCommits, value],\n" +
	"      ),\n" +
	"    );\n" +
	"  };\n" +
	"\n" +
	"  useMemo(\n" +
	"    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),\n" +
	"    [overallEvaluation?.summary],\n" +
	"  );\n" +
	"\n" +
	"  const replaceHashWithURL = (opportunities: any) => {\n" +
	"    let evalObj: any = {};\n" +
	"    codeEvaluation.forEach(({ evaluations }: any) => {\n" +
	"      evalObj[evaluations[0]?.hash] = evaluations[0]?.hash_url;\n" +
	"    });\n" +
	"\n" +
	"    if (typeof opportunities === \"string\") {\n" +
	"      Object.keys(evalObj).forEach((key) => {\n" +
	"        if (opportunities?.includes(key.slice(0, 7))) {\n" +
	"          opportunities = opportunities.replace(\n" +
	"            key.slice(0, 7),\n" +
	"            `[${key.slice(0, 7)}](${evalObj[key]})`,\n" +
	"          );\n" +
	"        } else if (opportunities?.includes(key.slice(0, 6))) {\n" +
	"          opportunities = opportunities.replace(\n" +
	"            key.slice(0, 6),\n" +
	"            `[${key.slice(0, 7)}](${evalObj[key]})`,\n" +
	"          );\n" +
	"        }\n" +
	"      });\n" +
	"\n" +
	"      return opportunities;\n" +
	"    }\n" +
	"\n" +
	"    const newOpp = opportunities?.map((opp: any) => {\n" +
	"      let updatedDescription = opp?.description;\n" +
	"\n" +
	"      Object.keys(evalObj).forEach((key) => {\n" +
	"        if (updatedDescription?.includes(key.slice(0, 7))) {\n" +
	"          updatedDescription = updatedDescription.replace(\n" +
	"            key.slice(0, 7),\n" +
	"            `<a target=\"_blank\" contenteditable=\"false\" style=\"cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;\" href=${\n" +
	"              evalObj[key]\n" +
	"            }>${key.slice(0, 7)}</a>`,\n" +
	"          );\n" +
	"        } else if (updatedDescription?.includes(key.slice(0, 6))) {\n" +
	"          updatedDescription = updatedDescription.replace(\n" +
	"            key.slice(0, 6),\n" +
	"            `<a target=\"_blank\" contenteditable=\"false\" style=\"cursor: pointer; background-color: #C9DBE9; width: fit-content; padding: 0rem 0.75rem; border-radius: 1rem; margin: auto; font-size: 0.875rem; color: #1A2636;\" href=${\n" +
	"              evalObj[key]\n" +
	"            }>${key.slice(0, 7)}</a>`,\n" +
	"          );\n" +
	"        }\n" +
	"      });\n" +
	"\n" +
	"      return {\n" +
	"        ...opp,\n" +
	"        description: updatedDescription,\n" +
	"      };\n" +
	"    });\n" +
	"    return newOpp;\n" +
	"  };\n" +
	"\n" +
	"  return (\n" +
	"    <div>\n" +
	"      <div\n" +
	"        className={`text-sm text-[#1A2636] p-1 ${\n" +
	"          editMode\n" +
	"            ? \"rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none\"\n" +
	"            : \" border-1 rounded-xl\"\n" +
	"        } `}\n" +
	"        onBlur={handleSummaryChange}\n" +
	"      >\n" +
	"        <MarkDownEditor\n" +
	"          editorRef={editorRef}\n" +
	"          markdown={\n" +
	"            overallEvaluation?.summary?.length > 0\n" +
	"              ? replaceHashWithURL(overallEvaluation?.summary)\n" +
	"              : \"No summary found\"\n" +
	"          }\n" +
	"          readOnly={!editMode}\n" +
	"          hideToolbar={true}\n" +
	"        />\n" +
	"      </div>\n" +
	"\n" +
	"      <div\n" +
	"        className={`flex ${\n" +
	"          !pathname?.includes(\"/package-creator\")\n" +
	"            ? \"flex-wrap\"\n" +
	"            : \"items-stretch\"\n" +
	"        }  justify-between gap-4 my-4`}\n" +
	"      >\n" +
	"        <Strength\n" +
	"          strengths={replaceHashWithURL(\n" +
	"            overallEvaluation?.evaluation?.strengths,\n" +
	"          )}\n" +
	"          editMode={editMode}\n" +
	"          onDataChange={(index: number, k: string, v: string) =>\n" +
	"            onDataChange(\"strengths\", index, k, v)\n" +
	"          }\n" +
	"        />\n" +
	"        <Opportunity\n" +
	"          opportunities={replaceHashWithURL(\n" +
	"            overallEvaluation?.evaluation?.opportunities,\n" +
	"          )}\n" +
	"          editMode={editMode}\n" +
	"          onDataChange={(index: number, k: string, v: string) =>\n" +
	"            onDataChange(\"opportunities\", index, k, v)\n" +
	"          }\n" +
	"        />\n" +
	"      </div>\n" +
	"      {codeEvaluation?.length > 0 &&\n" +
	"        codeEvaluation\n" +
	"          .flatMap((i: any, mainIndex: number) =>\n" +
	"            !i.evaluations?.length ? [] : { ...i, mainIndex },\n" +
	"          )\n" +
	"          ?.map(({ evaluations, mainIndex }: any, index: any) => {\n" +
	"            return (\n" +
	"              <div key={evaluations[0]?.hash}>\n" +
	"                <Artifact\n" +
	"                  editMode={editMode}\n" +
	"                  tags={evaluations[0]?.tags}\n" +
	"                  message={evaluations[0]?.artifact_summary_string}\n" +
	"                  value={evaluations[0]?.hash}\n" +
	"                  repoName={evaluations[0]?.repo_name}\n" +
	"                  title={\n" +
	"                    <span className=\"text-[#518AB9] font-semibold text-[17px]\">\n" +
	"                      Commit{\" \"}\n" +
	"                      <span\n" +
	"                        contentEditable={editMode}\n" +
	"                        className=\"outline-none\"\n" +
	"                        onBlur={(e) =>\n" +
	"                          onArtifactChange(\n" +
	"                            mainIndex,\n" +
	"                            \"hash\",\n" +
	"                            e.target.innerText,\n" +
	"                          )\n" +
	"                        }\n" +
	"                      >\n" +
	"                        {evaluations[0]?.hash?.slice(0, 7)}\n" +
	"                      </span>\n" +
	"                      :{\" \"}\n" +
	"                      <span\n" +
	"                        contentEditable={editMode}\n" +
	"                        className=\"outline-none\"\n" +
	"                        onBlur={(e) =>\n" +
	"                          onArtifactChange(\n" +
	"                            mainIndex,\n" +
	"                            \"commit_title\",\n" +
	"                            e.target.innerText,\n" +
	"                          )\n" +
	"                        }\n" +
	"                      >\n" +
	"                        {evaluations[0]?.commit_title}\n" +
	"                      </span>\n" +
	"                    </span>\n" +
	"                  }\n" +
	"                  viewOnly={\n" +
	"                    IS_WAYFAIR\n" +
	"                      ? true\n" +
	"                      : pathname?.includes(\"/package-creator\")\n" +
	"                      ? !expanded\n" +
	"                      : true\n" +
	"                  }\n" +
	"                  checked={selectedCommits?.includes(evaluations[0]?.hash)}\n" +
	"                  onCheck={handleCommitCheck}\n" +
	"                  no={index + 1}\n" +
	"                  url={evaluations[0]?.hash_url}\n" +
	"                  repoLink={evaluations[0]?.hash_url?.split(\"/commit\")[0]}\n" +
	"                  updatedAt={evaluations[0]?.committed_at}\n" +
	"                  onArtifactChange={(key: string, value: string) =>\n" +
	"                    onArtifactChange(\n" +
	"                      mainIndex,\n" +
	"                      key === \"message\" ? \"artifact_summary_string\" : key,\n" +
	"                      value,\n" +
	"                    )\n" +
	"                  }\n" +
	"                />\n" +
	"                {index !== codeEvaluation?.length - 1 && (\n" +
	"                  <Divider sx={{ margin: \"20px 0px\" }} />\n" +
	"                )}\n" +
	"              </div>\n" +
	"            );\n" +
	"          })}\n" +
	"\n" +
	"      {expanded && pathname?.includes(\"/package-creator\") && (\n" +
	"        <>\n" +
	"          {!showAddMore && !IS_WAYFAIR ? (\n" +
	"            <Button\n" +
	"              variant=\"text\"\n" +
	"              sx={{ mt: 2, textDecoration: \"underline\" }}\n" +
	"              onClick={() => {\n" +
	"                codeCommitsQuery.refetch();\n" +
	"                setShowAddMore(true);\n" +
	"              }}\n" +
	"              startIcon={<Add />}\n" +
	"            >\n" +
	"              Add more artifacts\n" +
	"            </Button>\n" +
	"          ) : (\n" +
	"            <div className=\"mt-6\">\n" +
	"              {\" \"}\n" +
	"              <AllCommits />\n" +
	"            </div>\n" +
	"          )}\n" +
	"          {showAddMore && !IS_WAYFAIR && (\n" +
	"            <>\n" +
	"              <div className=\"border-2 w-full border-[#C9DBE9] my-4\"></div>\n" +
	"              <div>\n" +
	"                <p className=\"text-[17px] font-semibold text-[#1A2636] \">\n" +
	"                  Add more artifacts:\n" +
	"                </p>\n" +
	"                <p className=\"text-[#1A2636] text-sm \">\n" +
	"                  Select from below list or upload more artifacts using URL\n" +
	"                  links.\n" +
	"                </p>\n" +
	"              </div>\n" +
	"              {codeCommitsQuery.data?.length && (\n" +
	"                <div className=\"max-h-[400px] overflow-auto my-4 \">\n" +
	"                  {codeCommitsQuery.data?.map((commit: any, index: number) => (\n" +
	"                    <Fragment key={commit?.id}>\n" +
	"                      <Artifact\n" +
	"                        url={commit?.url}\n" +
	"                        updatedAt={moment(commit?.committed_at).format(\n" +
	"                          \"MM/DD/YYYY, hh:mmA\",\n" +
	"                        )}\n" +
	"                        message={commit?.commit_message}\n" +
	"                        checked={selectedCommits?.includes(commit?.commit_sha)}\n" +
	"                        value={commit?.commit_sha}\n" +
	"                        onCheck={handleCommitCheck}\n" +
	"                        repoName={commit?.repo_name || \"\"}\n" +
	"                        no={\n" +
	"                          !!codeEvaluation?.artifacts?.length\n" +
	"                            ? codeEvaluation?.artifacts?.length + index + 1\n" +
	"                            : index + 1\n" +
	"                        }\n" +
	"                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${\n" +
	"                          commit?.commit_message\n" +
	"                        }`}\n" +
	"                      />\n" +
	"                      {index !== codeCommitsQuery.data?.length - 1 && (\n" +
	"                        <Divider />\n" +
	"                      )}\n" +
	"                    </Fragment>\n" +
	"                  ))}\n" +
	"                </div>\n" +
	"              )}\n" +
	"              {codeCommitsQuery.isFetching && <ContributionSkeleton />}\n" +
	"            </>\n" +
	"          )}\n" +
	"        </>\n" +
	"      )}\n" +
	"    </div>\n" +
	"  );\n" +
	"};\n" +
	"\n" +
	"const CodeContributionDraft = ({\n" +
	"  codeReview = null,\n" +
	"  overallEvaluationSummary = null,\n" +
	"  editMode = false,\n" +
	"  onRetry = () => {},\n" +
	"}: {\n" +
	"  codeReview?: any[] | null;\n" +
	"  overallEvaluationSummary?: any[] | null;\n" +
	"  editMode?: boolean;\n" +
	"  onRetry?: Function;\n" +
	"}) => {\n" +
	"  const packagingResult = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.packagingResult,\n" +
	"  );\n" +
	"  const stalePackageIds = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.stalePackageIds,\n" +
	"  );\n" +
	"  const selectedCommits: string[] = useSelector(\n" +
	"    (state: any) => state.packageCreatorSlice?.selectedCommits,\n" +
	"  );\n" +
	"  const [loading, setLoading] = useState(false);\n" +
	"\n" +
	"  return (\n" +
	"    <div>\n" +
	"      <DraftAccordion\n" +
	"        icon={<CodeIcon />}\n" +
	"        title=\"Code Contribution\"\n" +
	"        collapsedBody={\n" +
	"          <Output\n" +
	"            editMode={editMode}\n" +
	"            expanded={false}\n" +
	"            codeReview={codeReview}\n" +
	"            overallEvaluationSummary={overallEvaluationSummary}\n" +
	"          />\n" +
	"        }\n" +
	"        expandedBody={\n" +
	"          <Output\n" +
	"            editMode={editMode}\n" +
	"            expanded={true}\n" +
	"            codeReview={codeReview}\n" +
	"            overallEvaluationSummary={overallEvaluationSummary}\n" +
	"          />\n" +
	"        }\n" +
	"        copyText={{\n" +
	"          artifacts: combineEvaluations(packagingResult?.code_evaluation)\n" +
	"            ?.artifacts,\n" +
	"          ...packagingResult?.overall_evaluation?.code_evaluation,\n" +
	"        }}\n" +
	"        onRetry={() => {\n" +
	"          onRetry({\n" +
	"            status: \"draft\",\n" +
	"            isRegenerate: true,\n" +
	"            regenerate_section: \"code_evaluation\",\n" +
	"            setLoading: (b: boolean) => setLoading(b),\n" +
	"          });\n" +
	"        }}\n" +
	"        isRetrying={loading}\n" +
	"        disableRegenerate={areArraysSimilar(\n" +
	"          selectedCommits,\n" +
	"          stalePackageIds?.selectedCommits,\n" +
	"        )}\n" +
	"      />\n" +
	"    </div>\n" +
	"  );\n" +
	"};\n" +
	"\n" +
	"export default CodeContributionDraft;\n" +
	"\n";


  export const newCode = "import { useFetchCodeCommits } from \"@/hooks/useApi\";\n" +
	"import useAuth from \"@/hooks/useAuth\";\n" +
	"import { areArraysSimilar } from \"@/store/generalSlice\";\n" +
	"import {\n" +
	"  setPackagingResult,\n" +
	"  setSelectedCommitsForRepos,\n" +
	"} from \"@/store/packageCreatorSlice\";\n" +
	"import { combineEvaluations } from \"@/utils/generalFunctions\";\n" +
	"import { MDXEditorMethods } from \"@mdxeditor/editor\";\n" +
	"import Add from \"@mui/icons-material/Add\";\n" +
	"import { Divider } from \"@mui/material\";\n" +
	"import moment from \"moment\";\n" +
	"import { usePathname, useSearchParams } from \"next/navigation\";\n" +
	"import { Fragment, useEffect, useMemo, useRef, useState } from \"react\";\n" +
	"import { useDispatch, useSelector } from \"react-redux\";\n" +
	"import Button from \"../ui/Button\";\n" +
	"import { CodeIcon } from \"../ui/Icons\";\n" +
	"import ContributionSkeleton from \"../ui/loaders/ContributionSkeleton\";\n" +
	"import MarkDownEditor from \"../ui/MarkDownEditor\";\n" +
	"import { AllCommits } from \"./CommitsTable\";\n" +
	"import DraftAccordion from \"./DraftAccordion\";\n" +
	"import { Artifact, Opportunity, Strength } from \"./DraftComponents\";\n" +
	"\n" +
	"const Output = ({\n" +
	"  expanded,\n" +
	"  codeReview,\n" +
	"  editMode,\n" +
	"  overallEvaluationSummary,\n" +
	"}: {\n" +
	"  expanded: boolean;\n" +
	"  codeReview: any;\n" +
	"  editMode: boolean;\n" +
	"  overallEvaluationSummary: any;\n" +
	"}) => {\n" +
	"  const auth = useAuth();\n" +
	"  const { IS_WAYFAIR } = auth;\n" +
	"  const [showAddMore, setShowAddMore] = useState(false);\n" +
	"  const searchParams = useSearchParams();\n" +
	"  const userId = searchParams?.get(\"user_id\");\n" +
	"  const editorRef = useRef<MDXEditorMethods>(null);\n" +
	"  const selectedRepos: string[] = useSelector(\n" +
	"    (state: any) => state.packageCreatorSlice?.selectedRepos,\n" +
	"  );\n" +
	"  const selectedCommits: string[] = useSelector(\n" +
	"    (state: any) => state.packageCreatorSlice?.selectedCommits,\n" +
	"  );\n" +
	"  const pathname = usePathname();\n" +
	"  const dispatch = useDispatch();\n" +
	"  const codeCommitsQuery = useFetchCodeCommits({\n" +
	"    enabled: false,\n" +
	"    queryKey: [userId, [selectedRepos]],\n" +
	"    params: {\n" +
	"      filter: JSON.stringify({\n" +
	"        employee_id: userId,\n" +
	"        repo_id: selectedRepos,\n" +
	"        selected_commits: selectedCommits,\n" +
	"      }),\n" +
	"      sort: JSON.stringify({ sortDir: \"desc\" }),\n" +
	"    },\n" +
	"  });\n" +
	"  const codeEvaluation = !pathname?.includes(\"/package-creator\")\n" +
	"    ? codeReview\n" +
	"    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)\n" +
	"        ?.code_evaluation;\n" +
	"\n" +
	"  const packagingResult = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.packagingResult,\n" +
	"  );\n" +
	"  const overallEvaluation = !pathname?.includes(\"/package-creator\")\n" +
	"    ? overallEvaluationSummary\n" +
	"    : useSelector((state: any) => state?.packageCreatorSlice?.packagingResult)\n" +
	"        ?.overall_evaluation?.code_evaluation;\n" +
	"\n" +
	"  const onDataChange = (\n" +
	"    type: \"opportunities\" | \"strengths\",\n" +
	"    listIndex: number,\n" +
	"    key: string,\n" +
	"    value: string,\n" +
	"  ) => {\n" +
	"    const updatedData = {\n" +
	"      ...packagingResult?.overall_evaluation?.code_evaluation?.evaluation,\n" +
	"      [type]: packagingResult?.overall_evaluation?.code_evaluation?.evaluation[\n" +
	"        type\n" +
	"      ].map((listData: any, lI: number) =>\n" +
	"        lI === listIndex ? { ...listData, [key]: value } : listData,\n" +
	"      ),\n" +
	"    };\n" +
	"\n" +
	"    dispatch(\n" +
	"      setPackagingResult({\n" +
	"        ...packagingResult,\n" +
	"        overall_evaluation: {\n" +
	"          ...packagingResult?.overall_evaluation,\n" +
	"          code_evaluation: {\n" +
	"            ...packagingResult?.overall_evaluation?.code_evaluation,\n" +
	"            evaluation: updatedData,\n" +
	"          },\n" +
	"        },\n" +
	"      }),\n" +
	"    );\n" +
	"  };\n" +
	"  const onArtifactChange = (mainIndex: number, key: string, value: string) => {\n" +
	"    dispatch(\n" +
	"      setPackagingResult({\n" +
	"        ...packagingResult,\n" +
	"        code_evaluation: packagingResult?.code_evaluation?.map(\n" +
	"          (ev: any, mI: number) =>\n" +
	"            mI === mainIndex\n" +
	"              ? {\n" +
	"                  ...ev,\n" +
	"                  evaluations: [\n" +
	"                    {\n" +
	"                      ...ev?.evaluations[0],\n" +
	"                      [key]: value,\n" +
	"                    },\n" +
	"                  ],\n" +
	"                }\n" +
	"              : ev,\n" +
	"        ),\n" +
	"      }),\n" +
	"    );\n" +
	"  };\n" +
	"\n" +
	"  useEffect(() => {\n" +
	"    if (\n" +
	"      codeEvaluation?.length > 0 &&\n" +
	"      selectedCommits?.length === 0 &&\n" +
	"      pathname?.includes(\"/package-creator\") &&\n" +
	"      !IS_WAYFAIR\n" +
	"    ) {\n" +
	"      dispatch(\n" +
	"        setSelectedCommitsForRepos(\n" +
	"          codeEvaluation?.map(({ evaluations }: any) => evaluations[0]?.hash),\n" +
	"        ),\n" +
	"      );\n" +
	"    }\n" +
	"  }, [codeEvaluation]);\n" +
	"\n" +
	"  const handleSummaryChange = (e: any) => {\n" +
	"    dispatch(\n" +
	"      setPackagingResult({\n" +
	"        ...packagingResult,\n" +
	"        overall_evaluation: {\n" +
	"          ...packagingResult?.overall_evaluation,\n" +
	"          code_evaluation: {\n" +
	"            ...packagingResult?.overall_evaluation?.code_evaluation,\n" +
	"            summary: editorRef.current?.getMarkdown(),\n" +
	"          },\n" +
	"        },\n" +
	"      }),\n" +
	"    );\n" +
	"  };\n" +
	"\n" +
	"  const handleCommitCheck = (value: string) => {\n" +
	"    dispatch(\n" +
	"      setSelectedCommitsForRepos(\n" +
	"        selectedCommits?.includes(value)\n" +
	"          ? selectedCommits?.filter((v: string) => v !== value)\n" +
	"          : [...selectedCommits, value],\n" +
	"      ),\n" +
	"    );\n" +
	"  };\n" +
	"\n" +
	"  useMemo(\n" +
	"    () => editorRef.current?.setMarkdown(overallEvaluation?.summary),\n" +
	"    [overallEvaluation?.summary],\n" +
	"  );\n" +
	"\n" +
	"  return (\n" +
	"    <div>\n" +
	"      <div\n" +
	"        className={`text-sm text-[#1A2636] p-1 ${\n" +
	"          editMode\n" +
	"            ? \"rounded bg-blue-50 ring-1 ring-blue-200 border-half border-blue-100 outline-none\"\n" +
	"            : \" border-1 rounded-xl\"\n" +
	"        } `}\n" +
	"        onBlur={handleSummaryChange}\n" +
	"      >\n" +
	"        <MarkDownEditor\n" +
	"          editorRef={editorRef}\n" +
	"          markdown={\n" +
	"            overallEvaluation?.summary?.length > 0\n" +
	"              ? overallEvaluation?.summary\n" +
	"              : \"No summary found\"\n" +
	"          }\n" +
	"          readOnly={!editMode}\n" +
	"          hideToolbar={true}\n" +
	"        />\n" +
	"      </div>\n" +
	"\n" +
	"      <div\n" +
	"        className={`flex ${\n" +
	"          !pathname?.includes(\"/package-creator\")\n" +
	"            ? \"flex-wrap\"\n" +
	"            : \"items-stretch\"\n" +
	"        }  justify-between gap-4 my-4`}\n" +
	"      >\n" +
	"        <Strength\n" +
	"          strengths={overallEvaluation?.evaluation?.strengths}\n" +
	"          editMode={editMode}\n" +
	"          onDataChange={(index: number, k: string, v: string) =>\n" +
	"            onDataChange(\"strengths\", index, k, v)\n" +
	"          }\n" +
	"        />\n" +
	"        <Opportunity\n" +
	"          opportunities={overallEvaluation?.evaluation?.opportunities}\n" +
	"          editMode={editMode}\n" +
	"          onDataChange={(index: number, k: string, v: string) =>\n" +
	"            onDataChange(\"opportunities\", index, k, v)\n" +
	"          }\n" +
	"        />\n" +
	"      </div>\n" +
	"      {codeEvaluation?.length > 0 &&\n" +
	"        codeEvaluation?.flatMap(({ evaluations }: any, index: any) => {\n" +
	"          return !evaluations?.length ? (\n" +
	"            []\n" +
	"          ) : (\n" +
	"            <div key={evaluations[0]?.hash}>\n" +
	"              <Artifact\n" +
	"                editMode={editMode}\n" +
	"                tags={evaluations[0]?.tags}\n" +
	"                message={evaluations[0]?.artifact_summary_string}\n" +
	"                value={evaluations[0]?.hash}\n" +
	"                repoName={evaluations[0]?.repo_name}\n" +
	"                title={\n" +
	"                  <span className=\"text-[#518AB9] font-semibold text-[17px]\">\n" +
	"                    Commit{\" \"}\n" +
	"                    <span\n" +
	"                      contentEditable={editMode}\n" +
	"                      className=\"outline-none\"\n" +
	"                      onBlur={(e) =>\n" +
	"                        onArtifactChange(index, \"hash\", e.target.innerText)\n" +
	"                      }\n" +
	"                    >\n" +
	"                      {evaluations[0]?.hash?.slice(0, 7)}\n" +
	"                    </span>\n" +
	"                    :{\" \"}\n" +
	"                    <span\n" +
	"                      contentEditable={editMode}\n" +
	"                      className=\"outline-none\"\n" +
	"                      onBlur={(e) =>\n" +
	"                        onArtifactChange(\n" +
	"                          index,\n" +
	"                          \"commit_title\",\n" +
	"                          e.target.innerText,\n" +
	"                        )\n" +
	"                      }\n" +
	"                    >\n" +
	"                      {evaluations[0]?.commit_title}\n" +
	"                    </span>\n" +
	"                  </span>\n" +
	"                }\n" +
	"                viewOnly={\n" +
	"                  IS_WAYFAIR\n" +
	"                    ? true\n" +
	"                    : pathname?.includes(\"/package-creator\")\n" +
	"                    ? !expanded\n" +
	"                    : true\n" +
	"                }\n" +
	"                checked={selectedCommits?.includes(evaluations[0]?.hash)}\n" +
	"                onCheck={handleCommitCheck}\n" +
	"                no={index + 1}\n" +
	"                url={evaluations[0]?.hash_url}\n" +
	"                updatedAt={evaluations[0]?.committed_at}\n" +
	"                onArtifactChange={(key: string, value: string) =>\n" +
	"                  onArtifactChange(\n" +
	"                    index,\n" +
	"                    key === \"message\" ? \"artifact_summary_string\" : key,\n" +
	"                    value,\n" +
	"                  )\n" +
	"                }\n" +
	"              />\n" +
	"              {index !== codeEvaluation?.length - 1 && (\n" +
	"                <Divider sx={{ margin: \"20px 0px\" }} />\n" +
	"              )}\n" +
	"            </div>\n" +
	"          );\n" +
	"        })}\n" +
	"\n" +
	"      {expanded && pathname?.includes(\"/package-creator\") && (\n" +
	"        <>\n" +
	"          {!showAddMore && !IS_WAYFAIR ? (\n" +
	"            <Button\n" +
	"              variant=\"text\"\n" +
	"              sx={{ mt: 2, textDecoration: \"underline\" }}\n" +
	"              onClick={() => {\n" +
	"                codeCommitsQuery.refetch();\n" +
	"                setShowAddMore(true);\n" +
	"              }}\n" +
	"              startIcon={<Add />}\n" +
	"            >\n" +
	"              Add more artifacts\n" +
	"            </Button>\n" +
	"          ) : (\n" +
	"            <div className=\"mt-6\">\n" +
	"              {\" \"}\n" +
	"              <AllCommits />\n" +
	"            </div>\n" +
	"          )}\n" +
	"          {showAddMore && !IS_WAYFAIR && (\n" +
	"            <>\n" +
	"              <div className=\"border-2 w-full border-[#C9DBE9] my-4\"></div>\n" +
	"              <div>\n" +
	"                <p className=\"text-[17px] font-semibold text-[#1A2636] \">\n" +
	"                  Add more artifacts:\n" +
	"                </p>\n" +
	"                <p className=\"text-[#1A2636] text-sm \">\n" +
	"                  Select from below list or upload more artifacts using URL\n" +
	"                  links.\n" +
	"                </p>\n" +
	"              </div>\n" +
	"              {codeCommitsQuery.data?.length && (\n" +
	"                <div className=\"max-h-[400px] overflow-auto my-4 \">\n" +
	"                  {codeCommitsQuery.data?.map((commit: any, index: number) => (\n" +
	"                    <Fragment key={commit?.id}>\n" +
	"                      <Artifact\n" +
	"                        url={commit?.url}\n" +
	"                        updatedAt={moment(commit?.committed_at).format(\n" +
	"                          \"MM/DD/YYYY, hh:mmA\",\n" +
	"                        )}\n" +
	"                        message={commit?.commit_message}\n" +
	"                        checked={selectedCommits?.includes(commit?.commit_sha)}\n" +
	"                        value={commit?.commit_sha}\n" +
	"                        onCheck={handleCommitCheck}\n" +
	"                        repoName={commit?.repo_name || \"\"}\n" +
	"                        no={\n" +
	"                          !!codeEvaluation?.artifacts?.length\n" +
	"                            ? codeEvaluation?.artifacts?.length + index + 1\n" +
	"                            : index + 1\n" +
	"                        }\n" +
	"                        title={`Commit ${commit?.commit_sha?.slice(0, 7)}: ${\n" +
	"                          commit?.commit_message\n" +
	"                        }`}\n" +
	"                      />\n" +
	"                      {index !== codeCommitsQuery.data?.length - 1 && (\n" +
	"                        <Divider />\n" +
	"                      )}\n" +
	"                    </Fragment>\n" +
	"                  ))}\n" +
	"                </div>\n" +
	"              )}\n" +
	"              {codeCommitsQuery.isFetching && <ContributionSkeleton />}\n" +
	"            </>\n" +
	"          )}\n" +
	"        </>\n" +
	"      )}\n" +
	"    </div>\n" +
	"  );\n" +
	"};\n" +
	"\n" +
	"const CodeContributionDraft = ({\n" +
	"  codeReview = null,\n" +
	"  overallEvaluationSummary = null,\n" +
	"  editMode = false,\n" +
	"  onRetry = () => {},\n" +
	"}: {\n" +
	"  codeReview?: any[] | null;\n" +
	"  overallEvaluationSummary?: any[] | null;\n" +
	"  editMode?: boolean;\n" +
	"  onRetry?: Function;\n" +
	"}) => {\n" +
	"  const packagingResult = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.packagingResult,\n" +
	"  );\n" +
	"  const stalePackageIds = useSelector(\n" +
	"    (state: any) => state?.packageCreatorSlice?.stalePackageIds,\n" +
	"  );\n" +
	"  const selectedCommits: string[] = useSelector(\n" +
	"    (state: any) => state.packageCreatorSlice?.selectedCommits,\n" +
	"  );\n" +
	"  const [loading, setLoading] = useState(false);\n" +
	"\n" +
	"  return (\n" +
	"    <div>\n" +
	"      <DraftAccordion\n" +
	"        icon={<CodeIcon />}\n" +
	"        title=\"Code Contribution\"\n" +
	"        collapsedBody={\n" +
	"          <Output\n" +
	"            editMode={editMode}\n" +
	"            expanded={false}\n" +
	"            codeReview={codeReview}\n" +
	"            overallEvaluationSummary={overallEvaluationSummary}\n" +
	"          />\n" +
	"        }\n" +
	"        expandedBody={\n" +
	"          <Output\n" +
	"            editMode={editMode}\n" +
	"            expanded={true}\n" +
	"            codeReview={codeReview}\n" +
	"            overallEvaluationSummary={overallEvaluationSummary}\n" +
	"          />\n" +
	"        }\n" +
	"        copyText={{\n" +
	"          artifacts: combineEvaluations(packagingResult?.code_evaluation)\n" +
	"            ?.artifacts,\n" +
	"          ...packagingResult?.overall_evaluation?.code_evaluation,\n" +
	"        }}\n" +
	"        onRetry={() => {\n" +
	"          onRetry({\n" +
	"            status: \"draft\",\n" +
	"            isRegenerate: true,\n" +
	"            regenerate_section: \"code_evaluation\",\n" +
	"            setLoading: (b: boolean) => setLoading(b),\n" +
	"          });\n" +
	"        }}\n" +
	"        isRetrying={loading}\n" +
	"        disableRegenerate={areArraysSimilar(\n" +
	"          selectedCommits,\n" +
	"          stalePackageIds?.selectedCommits,\n" +
	"        )}\n" +
	"      />\n" +
	"    </div>\n" +
	"  );\n" +
	"};\n" +
	"\n" +
	"export default CodeContributionDraft;\n" +
	"\n";