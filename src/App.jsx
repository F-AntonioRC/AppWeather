import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from 'react' 

//SE MANDA A LLAMAR LA KEY PARA HACER USO DE LA API
const ApiWeather = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&q=`;

export default function AppClima() {

  //VARIABLES DE ESTADO DEL COMPONENTE
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);

  //OBJETO DE LA VARIABLE DE ESTADO
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  })

  //FUNCION ASINCRONA PARA LA VALIDACION DE LOS DATOS (NO RECOMENDABLE)
  const onSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: error.message
    });
    try {
      if(!city.trim()) throw { message: "El campo ciudad es obligatorio" }
      
      const reponse = await fetch(`${ApiWeather}${city}`);
      const data = await reponse.json();

      if(data.error) throw {message: data.error.message};
      
      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      })


    } catch (error) { 
        setError({
          error: true,
          message: error.message
        });
    } finally {
      setLoading(false);
    } 
  }

  return(
    <>
    <Container maxWidth="lg" sx={{mt: 2}}>

    <Typography variant="h3" component="h2" align="center" gutterBottom
    >Aplicacion de Clima con React + Vite y MaterialUI</Typography>

    <Box sx={{display: "grid", gap: 2}} component="form" autoComplete="off" onSubmit={onSubmit}
    >
      <TextField id="city" label="Ciudad" variant="outlined" size="small" required value={city}
      onChange={(e) => setCity(e.target.value)} error={error.error} helperText={error.message} />

      <LoadingButton type="submit" variant="contained" loading={loading} loadingIndicator="Buscando..."
      >Buscar</LoadingButton>

    </Box>

    {weather.city && (
      <Box sx={{mt:2, display: "grid", gap: 2, textAlign: "center"}}>
        <Typography variant="h4" component="h2">
          {weather.city}, {weather.country}
        </Typography>

      <Box component="img" alt={weather.conditionText} src={weather.icon} sx={{
        margin: "0 auto", 
      }} />
      
      <Typography variant="h5"  component="h3" >
        {weather.temp} °C
      </Typography>

      <Typography variant="h6" component="h4" >
        {weather.conditionText}
      </Typography>

      </Box>
    )}

    <Typography
    textAlign="center"
    sx={{mt:2, fontSize: "10px"}} >
      Powered by: {" "}
        <a href="https://www.weatherapi.com/"
        title="Weather API">
          WeatherAPI.com
        </a>


    </Typography>

    </Container>
    </>
  )
}
