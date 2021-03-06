import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import TocDrawerButton from './components/TocDrawerButton'
import LayoutBase from './LayoutBase'
import Card from './components/Card'
import LatestPostsGroup from './components/LatestPostsGroup'
import ArticleDetail from './components/ArticleDetail'
import TocDrawer from './components/TocDrawer'
import { useRef } from 'react'
import CONFIG_NEXT from './config_next'
import { ArticleLock } from './components/ArticleLock'

export const LayoutSlug = (props) => {
  const { post, latestPosts, lock, validPassword } = props
  const meta = {
    title: `${post.title} | ${BLOG.TITLE}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

  const drawerRight = useRef(null)
  const targetRef = typeof window !== 'undefined' ? document.getElementById('container') : null
  const floatSlot = post?.toc?.length > 1
    ? <div className='block lg:hidden'><TocDrawerButton onClick={() => {
      drawerRight?.current?.handleSwitchVisible()
    }} /></div>
    : null

  return (
    <LayoutBase
      {...props}
      meta={meta}
      floatSlot={floatSlot}
      rightAreaSlot={
        CONFIG_NEXT.RIGHT_LATEST_POSTS && <Card><LatestPostsGroup posts={latestPosts} /></Card>
      }
    >

      {!lock && <ArticleDetail {...props} />}

      {lock && <ArticleLock password={post.password} validPassword={validPassword} />}

      {/* 悬浮目录按钮 */}
      <div className='block lg:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>

    </LayoutBase>
  )
}
