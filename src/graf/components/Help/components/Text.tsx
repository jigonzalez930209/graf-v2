import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
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
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
          open={loading}
          onClick={() => {}}
        >
          <Loader />
        </Backdrop>
      ) : (
        <ReactMarkdown
          className='markdown-body'
          remarkPlugins={[remarkGfm, remarkSlug, remarkToc]}
          components={{}}
        >
          {text}
        </ReactMarkdown>
      )}
    </>
  )
}

export default MdText
