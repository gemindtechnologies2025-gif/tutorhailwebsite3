import { Card, Box, Skeleton, Grid, Container } from "@mui/material";

function TutorCardSkeleton() {
    return (
        <Card
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                height: 360,
                width: 280, // 🔥 FIXED WIDTH to ensure consistent card size
                mx: "auto",
            }}
        >
            <Skeleton variant="rectangular" width="100%" height={120} />
            <Box sx={{ p: 2, position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Skeleton variant="rounded" width={80} height={25} />
                </Box>
                <Skeleton width="70%" height={24} sx={{ mt: 2 }} />
                <Skeleton width="50%" height={18} sx={{ mt: 1 }} />
                <Skeleton width="80%" height={18} sx={{ mt: 1 }} />
                <Skeleton width="90%" height={18} sx={{ mt: 1 }} />
                <Skeleton width="100%" height={18} sx={{ mt: 1 }} />
                <Skeleton width="40%" height={22} sx={{ mt: 2 }} />
                <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 2 }} />
                <Skeleton
                    variant="circular"
                    width={32}
                    height={32}
                    sx={{ position: "absolute", bottom: 16, right: 16 }}
                />
            </Box>
        </Card>
    );
}

export default function SkeletonList() {
    return (
        <Container maxWidth="lg">
            <TutorCardSkeleton />
        </Container>
    );
}
