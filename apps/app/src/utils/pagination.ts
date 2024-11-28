import { Request } from 'express';

export function getNextPage(total: number, limit: number, page: number) {
  const totalPages = Math.ceil(total / limit);
  return page + 1 < totalPages ? page + 1 : null;
}

export function getNextPageUrl(
  req: Request,
  total: number,
  limit: number,
  page: number,
) {
  const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

  const queryParams = new URLSearchParams(req.query as Record<string, string>);

  const nextPage = getNextPage(total, limit, page);

  if (nextPage) {
    queryParams.set('page', nextPage.toString());
    return `${baseUrl}?${queryParams.toString()}`;
  } else {
    return null;
  }
}

export function getPagination(
  req: Request,
  total: number,
  limit: number,
  page: number,
) {
  const totalPages = Math.ceil(total / limit);
  return {
    next: getNextPageUrl(req, total, limit, page),
    totalPages,
  };
}
