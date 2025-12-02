import { Metadata } from 'next';
import { ScheduleManagementClient } from './schedule-management-client';

export const metadata: Metadata = {
  title: '일정 관리 | 관리자',
  description: '시간표 일정을 관리합니다.',
};

export default function AdminSchedulesPage() {
  return <ScheduleManagementClient />;
}
