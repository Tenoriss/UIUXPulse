import { Link, type LinkProps } from 'react-router-dom';
import { routes } from '@/config/site';
import { getReturnTo } from '@/lib/redirect';

export interface StartEvaluationLinkProps extends Omit<LinkProps, 'to'> {
  /** Where the visitor continues once signed in. */
  destination?: string;
}

/**
 * "Start an evaluation" entry point.
 *
 * Always routes through the start gate, which decides between the sign-in
 * redirect (carrying the intended destination) and the workspace. Keeping a
 * single component means no CTA can accidentally link straight past auth.
 */
export function StartEvaluationLink({
  destination = routes.evaluations,
  children,
  ...props
}: StartEvaluationLinkProps) {
  return (
    <Link to={getReturnTo(routes.startEvaluation, destination)} {...props}>
      {children}
    </Link>
  );
}
