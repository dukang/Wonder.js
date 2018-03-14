let getHandle = (name, state) =>
  switch name {
  | "defineLightCount" => DefineLightCountMainService.execHandle
  | _ =>
    WonderLog.Log.fatal(
      WonderLog.Log.buildFatalMessage(
        ~title="getHandle",
        ~description={j|unknown handle name: $name|j},
        ~reason="",
        ~solution={j||j},
        ~params={j||j}
      )
    )
  };