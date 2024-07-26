// components/HtmlRenderer.js

import React from 'react'
import parse from 'html-react-parser'

const HtmlRenderer = ({ htmlString }: {htmlString: string}) => {
  return <div>{parse(htmlString)}</div>
}

export default HtmlRenderer
