
export default function AppLogo() {
    return (
        <>
            <div className="flex items-center">
                <img
                    src="/storage/cd-logo-light.png"
                    alt="Logo"
                    className="h-13 w-auto dark:hidden"
                />
                <img
                    src="/storage/cd-logo.png"
                    alt="Logo"
                    className="hidden h-13 w-auto dark:block"
                />
            </div>
            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Check Disbursement
                </span>
            </div> */}
        </>
    );
}
