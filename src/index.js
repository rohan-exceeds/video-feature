import { registerRoot } from "remotion"


import Delba from "./compositions/delba"

registerRoot(function RemotionRoot() {
  return (
    <>
      <Delba />
    </>
  )
})
