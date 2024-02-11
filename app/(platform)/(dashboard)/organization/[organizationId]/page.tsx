import { Info } from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info';

const OrganizationIdPage = async () => {
  return (
    <div className='w-full mb-20'>
      <Info isPro />
    </div>
  );
};

export default OrganizationIdPage;
