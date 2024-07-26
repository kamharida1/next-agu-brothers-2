'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

type BreadcrumbProps = {
  homeElement: string,
  separator?: JSX.Element,
  containerClasses?: string,
  listClasses?: string,
  activeClasses?: string,
  capitalizeLinks?: boolean,
}

const Breadcrumb = ({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks,
}: BreadcrumbProps) => {

  const paths = usePathname()
  const pathNames = paths.split('/').filter((path) => path !== '') // Remove empty strings(.filter(path => path))
  return (
    <div className="breadcrumbs text-sm">
      <ul className={containerClasses}>
        <li className={listClasses}>
          <Link href={'/'}>{homeElement}</Link>
        </li>
        {pathNames.length > 0 && separator}
        {pathNames.map((path, index) => {
          let href = `/${pathNames.slice(0, index + 1).join('/')}`
          let itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses
          let itemLink = capitalizeLinks ? path[0].toUpperCase() + path.slice(1, path.length) : path
          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link href={href}>{itemLink}</Link>
              </li>
              {pathNames.length !== index + 1 && separator}
            </React.Fragment>
          )
        })}
      </ul>
    </div>
  )
}

export default Breadcrumb


 // const isLast = index === pathNames.length - 1
          // const link = capitalizeLinks
          //   ? path.charAt(0).toUpperCase() + path.slice(1)
          //   : path
          // return (
          //   <li key={index} className={listClasses}>
          //     <span className={isLast ? activeClasses : ''}>{link}</span>
          //     {!isLast && separator}
          //   </li>
          // )