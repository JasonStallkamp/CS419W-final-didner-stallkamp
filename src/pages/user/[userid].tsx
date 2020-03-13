import React from 'react';
import { useRouter } from 'next/router';
import PostExploreSection from '../../component/PostExploreSection'


export default function ShareStoryId(){
    const router = useRouter();
    const userID = router.query.userid;
    let query = `{
        getPostsByUser(userid:"`+userID +`")
        {
            id,
            title,
            author{
              username,
              id
            },
            tags
        }
      }`;
    console.log(router.query);
      return <PostExploreSection query={query}></PostExploreSection>
}
