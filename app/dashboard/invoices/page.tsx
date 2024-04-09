import { unstable_noStore } from 'next/cache';
export default async function Page() {
  async function getName() {
    unstable_noStore();
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return 'welcome to invoices';
  }
  const penis = await getName();
  return <p> {penis}</p>;
}
