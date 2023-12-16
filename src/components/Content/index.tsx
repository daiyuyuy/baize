import { ReactNode } from "react";

import styles from "./index.module.css";

export default function Content({
  children,
  title,
  operation,
}: {
  children?: ReactNode;
  title?: string;
  operation?: ReactNode;
}) {
  return (
    <div>
      <div className={styles.title}>
        {title}
        <span className={styles.operation}>{operation}</span>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
