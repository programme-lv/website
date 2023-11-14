import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@/contexts/UserContext'
// import NavigationBar from '@/components/NavigationBar';
import { Card } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LogOutButton from '@/components/LogOutButton';
import BreadcrumbNav from "@/components/BreadcrumbNav";
import NavFrame from "@/components/NavFrame";

export default function Profile() {
    return (
        <>
            {/*<NavigationBar active='profile' />*/}
            <NavFrame path={[{name: "Profils", link: "profile"}]}>
                <main className="container m-auto">
                    <BreadcrumbNav path={[{name: "Profils", link: "/profile"}]}/>
                    <UserData />
                </main>
            </NavFrame>
        </>
    )
}

function UserData() {
    const { userData, loginError } = useUser();
    const { t: tErrors } = useTranslation('errors')
    const { t: tCommon } = useTranslation('common')

    if (loginError) {
        return (
            <div className='flex flex-col border border-gray-400 rounded p-5 my-5 max-w-md'>
                <h1 className='text-2xl font-bold'>{tCommon("home_user_data")}</h1>
                <div className="my-2">
                    <strong>{tCommon("home_user_data_error_exclamation")}</strong> {tErrors(loginError.message)}
                </div>
            </div>
        )
    }
    if (!userData) return <div>authenticating...</div>

    return (
        <div className='flex flex-col border border-gray-400 rounded p-5 my-5 max-w-md'>
            <h1 className='text-2xl font-bold'>{tCommon("home_user_data")}</h1>
            <Card variant='outlined' className="my-5">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>lauks</TableCell>
                                <TableCell>vērtība</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>lietotāja id</TableCell>
                                <TableCell><strong>{userData.id}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>lietotājvārds</TableCell>
                                <TableCell><strong>{userData.username}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>vārds</TableCell>
                                <TableCell>{userData.firstName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>uzvārds</TableCell>
                                <TableCell>{userData.lastName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>e-pasts</TableCell>
                                <TableCell>{userData.email}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <div className="flex justify-end">
                <LogOutButton />
            </div>
        </div>
    )
}
