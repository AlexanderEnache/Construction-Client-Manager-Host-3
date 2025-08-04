import { EditProposalForm } from "@/components/editProposal";

type Params = Promise<{ id: string }>

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;
  return <EditProposalForm proposalId={id} />;
}
