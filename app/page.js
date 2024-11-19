'use client'
import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const colorPalette = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
  "#FFA500", "#800080", "#00FFFF", "#FFC0CB",
  "#A52A2A", "#808080", "#000000", "#FFFFFF",
  "#008000", "#ADD8E6", "#FF4500", "#DA70D6",
];

const gridSize = 50;

export default function Pirates() {
  const [user, setUser] = useState();
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [grid, setGrid] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("#FFFFFF"))
  );
  const [canPlace, setCanPlace] = useState(false);

  const fetchPixels = async () => {
    const { data, error } = await supabase.from("pixels").select("*");
    if (error) console.error(error)
    else {
      const newGrid = [...grid];
      data.forEach(({ xy, color }) => {
        console.log(xy)
        let x = xy.split(',')[0]
        let y = xy.split(',')[1]
        newGrid[x][y] = color;
      });
      setGrid(newGrid)
    };
  };

  const canPutNewPixel = async () => {
    if(user) {
      const { data, error } = await supabase.from("pixels").select('*').eq("user", user.email).limit(1).order("created_at", {ascending: false});
      if(data && data.length > 0){
        console.log(data)
        let lastPlaced = new Date(data[0].created_at);
        const now = new Date();
        const timeDiff = (now - lastPlaced) / 1000;
        console.log(timeDiff)
        if (timeDiff < 60) {
          return false;
        }

        return true;
      }else{
        return true;
      }
    }

    return false;
  }

  useEffect(() => {
    (async () => {
      let u = await supabase.auth.getUser()
      if(u.data){
        setUser(u.data.user);
        let cp = await canPutNewPixel();
        setCanPlace(cp);
      }
    })()
    fetchPixels();
  }, [])

  setInterval(async () => {
    let cp = await canPutNewPixel();
    setCanPlace(cp);
    fetchPixels();
  }, 5000)

  async function handleCellClick(row, col) {
    if(!user) {
      alert('Please login first !!')
      return;
    }

    if(!canPlace) {
      alert(`You need to wait 1 min to place new pixel.`);
      return;
    }

    const newGrid = [...grid];
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);

    const { error } = await supabase.from("pixels").upsert({
      xy: row+','+col,
      color: selectedColor,
      user: user.email,
    });

    if (error) console.error(error);

    setCanPlace(false);
  }

  async function signInWithSlack() {
    await supabase.auth.signInWithOAuth({
      provider: 'slack_oidc',
    })
  }

  return (
    <Box>
      <Box textAlign={'center'} width={'100%'}>
        <Text fontSize={'25px'} fontWeight={700} borderBottom={'1px solid #eee'} padding={'10px'}>PiratePixels</Text>
      </Box>
      {!user ? 
      <Box padding={'10px'} display={'flex'} gap={'10px'}>
        <Button backgroundColor={'blue.700'} onClick={signInWithSlack}>Sign in With Slack</Button>
        <Text color={'red.600'}>You can place pixels without signing in !!</Text>
      </Box> : 
      <Box padding={'10px'} display={'flex'} gap={'10px'}>
        <Text color={'green.600'}>Logged in as {user.identities[0].identity_data.name} !!</Text>
      </Box>}
      <Box 
        width='100%'
        overflow="hidden"
        p={1}
        display={'flex'}
        justifyContent={'center'}
        gap={'10px'}>
        <Box>
          <Text>Select Color</Text>
          <SimpleGrid gap={'1px'} columns={4}>
            {colorPalette.map((color) => (
              <Box
                key={color}
                width={'25px'}
                height={'25px'}
                backgroundColor={color}
                border={selectedColor === color ? "2px solid black" : "none"}
                onClick={() => setSelectedColor(color)}
                _hover={{cursor: 'pointer', transform: "scale(1.1)"}}>
              </Box>
            ))}
          </SimpleGrid>
          <Box marginTop={'10px'}>
            <Text>Selected Color: </Text>
            <Box width={'100%'} height={'50px'} background={selectedColor} border={'2px solid #000'}></Box>
          </Box>
        </Box>
        <SimpleGrid columns={gridSize} gap={0} border={'5px solid #000'}>
            {grid.map((row, rowIndex) => 
              row.map((cellColor, colIndex) => (
                <Box
                  key={`${rowIndex}-${colIndex}`}
                  bg={cellColor}
                  width="10px"
                  height="10px"
                  _hover={{ cursor: "pointer", opacity: 0.5, border: '1px solid #000' }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              ))
            )}
        </SimpleGrid >
      </Box>
    </Box>
  );
}
