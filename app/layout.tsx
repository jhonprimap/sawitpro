import './globals.css';
import ReportNav from './ReportNav';

export const metadata={title:'SawitPro',description:'Manajemen performa kebun sawit'};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="id"><body>{children}<ReportNav/></body></html>
}
