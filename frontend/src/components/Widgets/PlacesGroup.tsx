import { useRequest } from "@/hooks/useRequest";
import placesService from "@/services/placesService";
import { Box, Grid, Stack } from "@mui/material";
import { FC } from "react";
import AccountPlaceCard from "../Cards/AccountPlaceCard";
import { IPlace } from "@/types/IPlace";

interface Props {
  places: IPlace[];
}

const PlacesGroup: FC<Props> = ({ places }) => {

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { smallPhone: "1fr", largePhone: "repeat(2, 1fr)", smallTablet: "repeat(3, 1fr)" }, gap: 2 }}>
      {
        places.map(place => (
          <AccountPlaceCard key={place.id} place={place} />
        ))
      }
    </Box>
  )
};

export default PlacesGroup;