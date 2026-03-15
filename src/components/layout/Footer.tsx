import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#a20000] text-white pt-16 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          
          {/* Column 1: Logo & Description */}
          <div className="w-full lg:w-[45%]">
             <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                   <svg className="w-4 h-4 text-[#a20000]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5c-2.49 0-4.5-2.01-4.5-4.5S8.51 7.5 11 7.5s4.5 2.01 4.5 4.5c0 .34-.04.68-.11 1h-2.12c.15-.31.23-.65.23-1 0-1.38-1.12-2.5-2.5-2.5S8.5 10.62 8.5 12 9.62 14.5 11 14.5c.66 0 1.25-.26 1.7-.68l1.45 1.45c-.83.76-1.92 1.23-3.15 1.23z"/>
                   </svg>
                </div>
                <span className="text-[22px] font-bold tracking-wide">
                   CenterKick
                </span>
             </Link>
             <p className="text-white/80 text-[13px] leading-[1.8] pr-8 mb-8 font-light">
                Lörem ipsum od ohet dilogi. Bell trabel, samuligt, ohöbel utom diska. Jinesade bel när feras redorade i belogi. FAR paratyp i muvåning, och pesask vyfisat. Viktiga poddradio har un mad och inde.
             </p>
             
             {/* Social Icons */}
             <div className="flex items-center gap-5">
                <a href="#" className="text-white hover:text-white/70 transition-colors">
                   <svg width="12" height="18" viewBox="0 0 320 512" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                </a>
                <a href="#" className="text-white hover:text-white/70 transition-colors">
                   <svg width="18" height="15" viewBox="0 0 512 512" fill="currentColor"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.671 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
                </a>
                <a href="#" className="text-white hover:text-white/70 transition-colors">
                   <svg width="16" height="15" viewBox="0 0 448 512" fill="currentColor"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>
                </a>
                <a href="#" className="text-white hover:text-white/70 transition-colors">
                   <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                </a>
             </div>
          </div>
          
          {/* Column 2: Pages Links */}
          <div className="w-full lg:w-[15%]">
            <h3 className="mb-5 text-[14px] font-bold text-white tracking-wide">Pages</h3>
            <ul className="text-white/80 space-y-3 text-[12px] font-light">
               <li><Link href="/" className="hover:text-white transition-colors">FAQ</Link></li>
               <li><Link href="/news" className="hover:text-white transition-colors">Agency</Link></li>
               <li><Link href="/matches" className="hover:text-white transition-colors">Legal</Link></li>
               <li><Link href="/players" className="hover:text-white transition-colors">Matches</Link></li>
            </ul>
          </div>

          {/* Column 3: Service Links */}
          <div className="w-full lg:w-[18%]">
            <h3 className="mb-5 text-[14px] font-bold text-white tracking-wide">Service</h3>
            <ul className="text-white/80 space-y-3 text-[12px] font-light">
               <li><Link href="/" className="hover:text-white transition-colors">Coaching</Link></li>
               <li><Link href="/news" className="hover:text-white transition-colors">Find a Football Academy</Link></li>
               <li><Link href="/matches" className="hover:text-white transition-colors">Agency</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div className="w-full lg:w-[22%]">
            <h3 className="mb-5 text-[14px] font-bold text-white tracking-wide">Contact</h3>
            <ul className="text-white/80 space-y-3 text-[12px] font-light">
               <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                  <span>(406) 555-0120</span>
               </li>
               <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
                  <a href="mailto:centrekick123@gmail.com" className="hover:text-white transition-colors">centrekick123@gmail.com</a>
               </li>
               <li className="flex items-start gap-2 mt-1">
                  <svg className="w-3 h-3 text-white mt-1 shrink-0" fill="currentColor" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                  <span className="leading-[1.4]">2972 Westheimer Rd. Santa Ana, Illinois 85486</span>
               </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
