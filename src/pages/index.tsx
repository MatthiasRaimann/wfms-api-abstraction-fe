import axios, { isAxiosError } from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import { JsonView, defaultStyles } from "react-json-view-lite";
import 'react-json-view-lite/dist/index.css';
import { Link, ResourceEndpoint } from "../../lib/Response";
import classes from './styling.module.css';

export default function Home() {
  const [res, setRes] = useState<ResourceEndpoint>()
  const [err, setErr] = useState<object>()
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { requestWrapper('/ParentProcess', 'GET') }, [])


  if (res === undefined) return <div>Keine Daten...</div>
  return (
    <>
      <div className={classes.wrapper}>
        <div>
          <h2>Daten</h2>
          <p>Name: {res.name}</p>
          <p>Typ: {res.type}</p>
          {res.data as object | undefined && <JsonView data={res.data as object} style={defaultStyles} />}
          <h2>Operationen</h2>
          {Object.entries(res._links.operations).map(([key, value]: [string, Link]) => (
            <div key={key}>
              <button onClick={() => requestWrapper(value.href, value.method)}>{key}</button>
            </div>
          ))}



          {
            // @ts-expect-error
            res._links.operations?.complete && (<>
              <p>Werte setzen</p>
              <textarea ref={textareaRef} defaultValue={JSON.stringify(res.data)} style={{ width: '100%' }} /></>)
          }

          <h2>Parents</h2>
          {res._links.parents.map(parent => (
            <div className={classes.listing} key={parent}><a style={{ cursor: 'pointer', margin: '5px' }} onClick={() => requestWrapper(parent)}>{parent}</a></div>
          ))}
          <h2>Children</h2>
          {res._links.children.map(child => (
            <div className={classes.listing} key={child}><a style={{ cursor: 'pointer', margin: '5px' }} onClick={() => requestWrapper(child)}>{child}</a></div>
          ))}
        </div>
        <div>
          <h2>Succes respone from server</h2>
          <JsonView data={res} style={defaultStyles} />

          {err ? (<>
            <h2>Error response</h2>
            <JsonView data={err} style={defaultStyles} />
          </>) : null}
        </div>
      </div>
    </>
  );

  async function requestWrapper(path: string, method = 'GET'): Promise<ResourceEndpoint | undefined> {
    const data = method === 'POST' || method === 'PUT'
      ? JSON.parse(textareaRef.current?.value || '{}') :
      undefined

    return axios<ResourceEndpoint>({
      method,
      url: `http://localhost:3003${path}`,
      data
    })
      .then(res => {
        setRes(res.data)
        setErr(undefined)
        return res.data
      })
      .catch((err) => {
        console.error(err)
        if (isAxiosError(err)) setErr(err.response?.data)
        return undefined
      })
  }
}

