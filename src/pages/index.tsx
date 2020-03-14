import PostExploreSection from '../component/PostExploreSection';
import Router from 'next/router';
import React,{useEffect} from 'react';


function Home(){
  useEffect(() => {
    Router.push('/explore');

 });
 return null;

  // return <PostExploreSection query={`
  // {
  //     getLatestPosts(max:20)
  //     {
  //       $values
  //     }
  //   }
  // `}></PostExploreSection>
}

export default Home;
