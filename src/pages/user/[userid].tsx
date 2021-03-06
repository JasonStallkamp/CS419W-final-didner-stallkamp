import React from 'react';
import { useRouter } from 'next/router';
import PostExploreSection from '../../component/PostExploreSection'


export default function ShareStoryId(){
    const router = useRouter();
    const userID = router.query.userid;
    let query = `{
        getPostsByUser(userid:"`+userID +`")
        {
            $values
        }
      }`;
      return (
      <div>
            <PostExploreSection query={query}></PostExploreSection>
      </div>)
}
