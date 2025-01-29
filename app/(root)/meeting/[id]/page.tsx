import React from 'react'

// export default async function Meeting({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const id = (await params).id
//   return <div>Meeting Room: #{id}</div>
// }

const Meeting = ( { params }: {params: { id : string }}) => {
  return (
    <div>Meeting ROOM : #{params.id}</div> // rendering id
  )
}

export default Meeting;

//syncronous code and the app expects params to be avaliable imediatly
// if we use a prmoise it makes it so coide is asynronous, so if param is not avalibe the app will run other code  