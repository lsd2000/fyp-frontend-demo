import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AccountPage: React.FC = () =>{
    return(
        <ContentLayout title="Account">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="rounded-lg border-none mt-6 ">
          <CardContent className="p-6 ">
            <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] ">
              <div className="flex flex-col relative min-w-full">
                <h1>
                    This is the account page. This will not be developed since there is no authentication or authorization
                </h1>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    )
}

export default AccountPage;