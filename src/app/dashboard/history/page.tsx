
import { currentUser } from "@clerk/nextjs/server"
import UserContentHistory from "./_components/history"

const History = async() => {
  const user = await currentUser()
  // console.log("current user->", user)
  console.log(user?.fullName)
  const userEmailId:string | undefined = user?.emailAddresses[0].emailAddress
  // const emailAddArray :Array<string>=  user?.emailAddresses
  // if(emailAddArray.length>1){
  //   for (let email in emailAddArray){
  //     console.log(email)
  //   }
  // }

  return (
    <div>
      <UserContentHistory />
    </div>
  )
}

export default History


//pre rendering data fetching

// export const getStaticProps = async (context) => {

//   const meetupId = context.params.meetupId

  
//   // client.close()

//   return {
//       props: {
//           userHistoryData:{
//               // title:selectedMeetup.title,
//               // address:selectedMeetup.address,
//               // image: selectedMeetup.image,
//               // description: selectedMeetup.description

//           }
//       },
//   }
// }
