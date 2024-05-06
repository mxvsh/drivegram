'use client';

import {
  Fragment,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import {
  usePathname,
  useSearchParams,
} from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '#/lib/components/ui/breadcrumb';

function Path() {
  const [client, setClient] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsPath = searchParams.get('path');

  const path =
    paramsPath?.split('/').filter(Boolean) ?? [];

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <div className="flex border-b p-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={pathname}>/</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {client &&
            path.map((p, i) => {
              const url = new URL(
                window.location.href,
              );
              const href = path
                .slice(0, i + 1)
                .join('/');
              url.searchParams.set(
                'path',
                `/${href}`,
              );

              return (
                <Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={url.toString()}>
                        {p}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default Path;
