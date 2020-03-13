import PostExploreSection from '../component/PostExploreSection'



export default function Explore() {
    return <PostExploreSection query={`
    {
        getLatestPosts(max:20)
        {
            $values
        }
      }
    `}></PostExploreSection>
};
  