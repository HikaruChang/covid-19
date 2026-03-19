'use client';

import HotelIcon from '@mui/icons-material/Hotel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import RoleIndex from '@/components/RoleIndex';

const routes = [
  {
    path: '/staff/accommodations',
    title: '医护人员免费住宿',
    subtitle: '为医护人员提供免费住宿信息列表，支持地理位置排序与地区过滤，以提供基本生活保障',
    icon: <HotelIcon fontSize="inherit" />,
  },
  {
    path: '/staff/platforms/psychological',
    title: '线上心理咨询平台',
    subtitle: '我们为您提供免费心理咨询平台的查询，包括基本信息与其联系方式',
    icon: <FavoriteIcon fontSize="inherit" />,
  },
  {
    path: '/staff/supplies',
    title: '医疗机构物资需求',
    subtitle: '支持紧急程度与需求核验公示、按照地区过滤等多种功能，方便直观了解情况',
    icon: <FindInPageIcon fontSize="inherit" />,
    icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <FindInPageIcon key="f" fontSize="inherit" />],
    color: '#a20002',
  },
  {
    path: '/staff/supplies/submit',
    title: '提交医疗物资需求',
    subtitle: '提交新的医疗机构物资需求。提交后将交由内部信息组与官方渠道进行沟通，确保真实性与时效性后，发布于需求列表中',
    icon: <NoteAddIcon fontSize="inherit" />,
    icons: [<LocalHospitalIcon key="h" fontSize="inherit" />, <NoteAddIcon key="n" fontSize="inherit" />],
  },
];

export default function StaffIndexPage() {
  return <RoleIndex title="医护人员信息主页" routes={routes} />;
}
