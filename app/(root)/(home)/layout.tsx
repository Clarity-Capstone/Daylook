

// import React, { ReactNode } from 'react';
// import Sidebar from '../../../components/sidebar';
// import Navbar from '@/components/Navbar';

// const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
//   return (
//     <main className="relative">
//       <Navbar />

//       <div className="flex">
//         <Sidebar />

//         <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
//           <div className="w-full">{children}</div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default RootLayout;
// app/home/layout.tsx
import React, { ReactNode } from 'react';

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default HomeLayout;
