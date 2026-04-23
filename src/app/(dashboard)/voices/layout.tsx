import { VoicesLayout } from "@/features/voices/views/voices-layout"

export default async function Layout({children}:{children:React.ReactNode}){
    return (
        <VoicesLayout>
            {children}
        </VoicesLayout>
    );
};