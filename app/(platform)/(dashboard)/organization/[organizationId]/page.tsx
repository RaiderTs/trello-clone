import { BoardList } from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/board-list';
import { Info } from '@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info';
import { Separator } from '@/components/ui/separator';

const OrganizationIdPage = async () => {
  return (
    <div className='w-full mb-20'>
      <Info isPro />
      <Separator className={'my-4'} />
      <div className='px-2 md:px-4'>
        <BoardList />
      </div>
    </div>
  );
};

export default OrganizationIdPage;
