'use client';

import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import RoleIndex from '@/components/RoleIndex';

const routes = [
  {
    path: '/volunteer/supplies',
    title: '医疗机构物资需求',
    subtitle: '支持紧急程度与需求核验公示、按照地区过滤等多种功能，方便直观了解情况',
    icon: <LocalHospitalIcon fontSize="inherit" />,
    icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <FindInPageIcon key="f" fontSize="inherit" />],
    color: '#a20002',
  },
  {
    path: '/volunteer/supplies/submit',
    title: '提交医疗物资需求',
    subtitle: '提交新的医疗机构物资需求。提交后将交由内部信息组与官方渠道进行沟通，确保真实性与时效性后，发布于需求列表中',
    icon: <NoteAddIcon fontSize="inherit" />,
    icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <NoteAddIcon key="n" fontSize="inherit" />],
  },
];

export default function VolunteerIndexPage() {
  return <RoleIndex title="志愿者信息主页" routes={routes} />;
}
