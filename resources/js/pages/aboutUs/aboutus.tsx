import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Group, LightbulbIcon, Rocket } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function AboutUs() {
    const values = [
        {
            icon: <LightbulbIcon color="primary" />,
            title: 'Innovation',
            desc: 'We push boundaries and challenge the status quo.',
        },
        {
            icon: <Group color="primary" />,
            title: 'Community',
            desc: 'Built by people, for people. Connection is our core.',
        },
        {
            icon: <Rocket color="primary" />,
            title: 'Growth',
            desc: 'Scaling solutions that make a global impact.',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Box>
                {/* Hero Section */}

                <Container maxWidth="lg">
                    {/* Our Story Section */}
                    <Grid
                        container
                        spacing={6}
                        alignItems="center"
                        sx={{ mb: 10 }}
                    >
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    borderRadius: 4,
                                    boxShadow: 3,
                                }}
                                alt="Team working"
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="overline"
                                color="primary"
                                fontWeight="bold"
                            >
                                Our Story
                            </Typography>
                            <Typography
                                variant="h4"
                                gutterBottom
                                fontWeight="bold"
                            >
                                We’re on a mission to redefine the future.
                            </Typography>
                            <Typography
                                variant="body1"
                                paragraph
                                color="text.secondary"
                            >
                                Founded in 2024, we realized that the gap
                                between complex technology and human intuition
                                was too wide. We set out to bridge that gap.
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Today, we support thousands of users globally,
                                ensuring that every interaction is seamless,
                                meaningful, and efficient.
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Core Values */}
                    <Box sx={{ mb: 10 }}>
                        <Typography
                            variant="h4"
                            align="center"
                            fontWeight="bold"
                            gutterBottom
                        >
                            What we stand for
                        </Typography>
                        <Grid container spacing={4} sx={{ mt: 2 }}>
                            {values.map((value, index) => (
                                <Grid size={{ xs: 12, md: 4 }} key={index}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            textAlign: 'center',
                                            p: 2,
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ mb: 2 }}>
                                                {value.icon}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                gutterBottom
                                            >
                                                {value.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {value.desc}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Call to Action */}
                </Container>
            </Box>
        </AppLayout>
    );
}
