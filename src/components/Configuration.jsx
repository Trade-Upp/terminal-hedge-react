import CodeMirror from "@uiw/react-codemirror";
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

import ContentContainer from "./ContentContainer";

export default function Configuration({ config, setConfig }) {

  return (
    <>
      <ContentContainer>
        <div className="flex flex-row">
          <CodeMirror
            value={config}
            onChange={(value) => setConfig(value)}
            height="600px"
            basicSetup={{ syntaxHighlighting: true }}
            className="size-full text-left"
            extensions={json()}
            theme={vscodeDark} />
        </div>
      </ContentContainer>
    </>
  )
}
