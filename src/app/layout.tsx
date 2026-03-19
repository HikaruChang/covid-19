import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: {
    default: 'COVID-19.ICU | 多维度信息整合平台',
    template: '%s | COVID-19.ICU',
  },
  description:
    '面向疫区内外民众和医疗机构的多维度综合信息平台。提供社区物资需求、医疗机构物资需求、线上医疗诊断、线上心理咨询、医护住宿等信息。',
  keywords: [
    'COVID-19',
    '新冠肺炎',
    '武汉',
    '疫情',
    '物资需求',
    '医护人员',
    '志愿者',
    '心理援助',
    '线上医疗',
  ],
  authors: [{ name: 'wuhan-support', url: 'https://covid-19.icu' }],
  metadataBase: new URL('https://covid-19.icu'),
  openGraph: {
    type: 'website',
    url: 'https://covid-19.icu',
    siteName: 'COVID-19.ICU',
    title: 'COVID-19.ICU | 多维度信息整合平台',
    description:
      '面向疫区内外民众和医疗机构的多维度综合信息平台。提供社区物资需求、医疗机构物资需求、线上医疗诊断、线上心理咨询、医护住宿等信息。',
    images: [{ url: '/images/logo-red.svg', width: 800, height: 182, alt: 'COVID-19.ICU' }],
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary',
    title: 'COVID-19.ICU | 多维度信息整合平台',
    description: '面向疫区内外民众和医疗机构的多维度综合信息平台',
    images: ['/images/logo-red.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#a20002' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#a20002',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body style={{ margin: 0 }}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
