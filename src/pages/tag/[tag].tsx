import React from 'react';
import { useRouter } from 'next/router';
import PostExploreSection from '../../component/PostExploreSection'


export default function ShareStoryId(){
    const router = useRouter();
    const tag = router.query.tag;
    let query = `{
        getPostByTag(tag:"`+tag +`")
        {
            $values
        }
      }`;
      return (
      <div>
            <PostExploreSection query={query}></PostExploreSection>
      </div>)
}
