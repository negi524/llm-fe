import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";

import "./markdown.modules.scss";

export default function Markdown(props: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkMath, { singleDollarTextMath: false }],
          remarkBreaks,
        ]}
      >
        {props.content}
      </ReactMarkdown>
    </div>
  );
}
