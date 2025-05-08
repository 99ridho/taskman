import LoginContent from "./content";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamMessage = (await searchParams).message as string;
  return <LoginContent message={searchParamMessage} />;
};

export default LoginPage;
