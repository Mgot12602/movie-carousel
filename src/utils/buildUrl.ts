function buildUrl(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return `${endpoint}?${queryString}`;
}

export default buildUrl;
