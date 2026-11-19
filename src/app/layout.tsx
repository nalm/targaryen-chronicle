import type { Metadata } from 'next';
import { Cinzel, Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif-kr',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-kr',
});

export const metadata: Metadata = {
  title: '불과 피의 연대기 · 타르가르옌 가문 & 용 계보',
  description:
    '하우스 오브 드래곤과 왕좌의 게임 속 타르가르옌 가문의 혈연·혼인·계승 관계와 역대 용들의 기수 계보를 탐색하는 인터랙티브 웹앱',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`dark ${cinzel.variable} ${notoSerifKr.variable} ${notoSansKr.variable}`}
    >
      <body className="bg-[#09080c] text-[#ece6da] antialiased selection:bg-[#b91c1c]/40 selection:text-[#f5dfa0]">
        {children}
      </body>
    </html>
  );
}
