// 'use client'

// import Link from 'next/link'
// import { useSelectedLayoutSegments } from 'next/navigation'
// import React from 'react'

// type BreadcrumbProps = {
//   homeElement: string
//   separator?: JSX.Element
//   containerClasses?: string
//   listClasses?: string
//   activeClasses?: string
//   capitalizeLinks?: boolean
//   parallelRoutesKey?: string // Adding this prop
// }

// const Breadcrumb = ({
//   homeElement,
//   separator,
//   containerClasses,
//   listClasses,
//   activeClasses,
//   capitalizeLinks,
//   parallelRoutesKey, // Destructuring this prop
// }: BreadcrumbProps) => {
//   const segments = useSelectedLayoutSegments(parallelRoutesKey)
//   const pathNames = segments.map((segment) => segment)

//   return (
//     <nav aria-label="breadcrumb">
//       <ol className={containerClasses}>
//         <li className={listClasses}>
//           <Link href="/">
//             {homeElement}
//           </Link>
//         </li>
//         {pathNames.map((path, index) => {
//           const isLast = index === pathNames.length - 1
//           const link = capitalizeLinks
//             ? path.charAt(0).toUpperCase() + path.slice(1)
//             : path
//           return (
//             <li key={index} className={listClasses}>
//               {isLast ? (
//                 <span className={activeClasses}>{link}</span>
//               ) : (
//                 <Link href={`/${path}`}>
//                   {link}
//                 </Link>
//               )}
//               {!isLast && separator}
//             </li>
//           )
//         })}
//       </ol>
//     </nav>
//   )
// }

// export default Breadcrumb
import { clsx } from 'clsx'
import Link from 'next/link'


interface Breadcrumb {
  label: string
  href: string
  active?: boolean
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[]
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx('flex text-xl md:text-2xl')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
