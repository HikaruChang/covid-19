'use client';

import RoleIndex from '@/components/RoleIndex';
import SearchIcon from '@mui/icons-material/Search';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HotelIcon from '@mui/icons-material/Hotel';

const routes = [
  {
    path: '/people/supplies',
    title: '社区物资需求列表',
    subtitle: '为民众设置的社区物资需求列表，便于各民众发布自己的个人物资需求以便进行针对性帮助',
    icon: <SearchIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    path: '/people/supplies/submit',
    title: '提交社区物资需求',
    subtitle: '提交新的社区物资需求。提交后将发布于社区物资需求列表中',
    icon: <NoteAddIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    path: '/people/platforms/medical',
    title: '线上医疗诊断平台',
    subtitle: '足不出户即可与众多知名医院专家连线进行远程诊疗',
    icon: <LocalHospitalIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    path: '/people/platforms/psychological',
    title: '线上心理咨询平台',
    subtitle: '我们提供免费心理咨询平台的查询，包括基本信息与其联系方式',
    icon: <FavoriteIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    path: '/people/accommodations',
    title: '武汉在外人员住宿',
    subtitle: '提供武汉在外人员的住宿信息，保障这些群体的基本生活',
    icon: <HotelIcon sx={{ fontSize: 'inherit' }} />,
  },
];

export default function PeoplePage() {
  return <RoleIndex title="市民信息" routes={routes} />;
}
