'use client';

import { Typography, Box } from '@mui/material';

export default function HomeDescription() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        我们是？
      </Typography>
      <Typography variant="subtitle1" sx={{ lineHeight: 1.8, mb: 3 }}>
        我们关注你所关注的，我们支持需要支持的：面向疫区内外民众和医疗机构的多维度综合信息平台。中国加油，我们在一起！
        <br />
        #中国加油 |{' '}
        <a href="https://covid-19.icu">https://covid-19.icu</a>
      </Typography>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        服务对象
      </Typography>
      <Typography variant="subtitle1" sx={{ lineHeight: 1.8, mb: 3 }}>
        <strong>对普通市民</strong>
        ：疫情防控、流言辟谣、义诊平台、免费心理咨询
        <br />
        <strong>对医护人员</strong>
        ：需求发布平台、免费住宿及餐食、免费心理咨询、医疗器械捐赠
        <br />
        <strong>对志愿者</strong>：医疗机构物资需求查询
      </Typography>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        项目特点
      </Typography>
      <Box component="ul" sx={{ lineHeight: 1.8, mb: 3, fontSize: '1.05rem' }}>
        <li>✅ <strong>非盈利</strong>：保证中立性</li>
        <li>✅ <strong>综合平台</strong>：信息涵盖面广，受众类型多样</li>
        <li>✅ <strong>响应及时</strong>：推送最新一线信息</li>
        <li>✅ <strong>国际化项目</strong>：欢迎任何形式合作</li>
      </Box>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        分享
      </Typography>
      <Typography variant="subtitle1" sx={{ lineHeight: 1.8 }}>
        欢迎点击右上角分享<strong>综合信息平台</strong>
        ，让更多朋友了解疫情发展、让更多医护人员的生活具有基本保障！中国加油，我们在一起！
      </Typography>
    </Box>
  );
}
