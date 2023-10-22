import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'

import Loader from '@/components/loader'

import './style-md.css'

const MdText = ({ style, mdPath }) => {
  const [text, setText] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    fetch(mdPath)
      .then((res) => {
        return res.text()
      })
      .then((text) => setText(text))
      .finally(() => setLoading(false))
  }, [mdPath])

  return (
    <>
      {loading ? (
        <div
          style={{ color: '#fff', zIndex: 500 }}
          // open={loading}
          onClick={() => {}}
        >
          <Loader />
        </div>
      ) : (
        <ReactMarkdown
          className='markdown-body'
          remarkPlugins={[remarkGfm, remarkToc]}
          components={{}}
        >
          {text}
        </ReactMarkdown>
      )}
    </>
  )
}

export default MdText
