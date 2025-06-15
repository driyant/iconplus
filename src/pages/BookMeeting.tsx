import {
  Box,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
} from '@chakra-ui/react';
import TopMainHeader from '../components/TopMainHeader';
import { FiCalendar } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
// import axios from 'axios';
import {
  getMasterMeetingRoomsUrl,
  getMasterOfficeUrl,
  getMasterOfMealTypeUrl,
  time,
} from '../utils/constant';
import { getTimeEndOptions, parseTimeToHour } from '../utils';

const BookMeeting = () => {
  const toast = useToast();
  const [units, setUnits] = useState<any[]>([]);
  const [meetingRooms, setMeetingRooms] = useState<string[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [capacity, setCapacity] = useState<number>(0);
  const [selectedRoomName, setSelectedRoomName] = useState<string>('');
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(0);
  const [numberOfParticipantsInput, setNumberOfParticipantsInput] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeStart, setTimeStart] = useState<string>('');
  const [timeEndOptions, setTimeEndOptions] = useState<any[]>([]);
  const [timeEnd, setTimeEnd] = useState<string>('');
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  async function fetchUnit() {
    try {
      let url = getMasterOfficeUrl;
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        url = '/mockApi/masterOffice.json';
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: 'Error fetching units',
        description: 'Unable to load unit data. Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function fetchRoomMeeting() {
    try {
      let url = getMasterMeetingRoomsUrl;
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        url = '/mockApi/masterMeetingRooms.json';
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMeetingRooms(data);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error fetching room meeting',
        description: 'Unable to load unit data. Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function fetchMealTypes() {
    try {
      let url = getMasterOfMealTypeUrl;
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        url = '/mockApi/masterJenisKonsumsi.json';
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMealTypes(data);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error fetching meal types',
        description: 'Unable to load unit data. Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    document.title = 'Book Room Meeting';
    fetchUnit();
    fetchRoomMeeting();
    fetchMealTypes();
  }, []);

  useEffect(() => {
    const newTimeEndOptions = getTimeEndOptions(time, timeStart);
    // console.log(newTimeEndOptions, 'New Time End Options');
    setTimeEndOptions(newTimeEndOptions);
  }, [timeStart]);

  useEffect(() => {
    if (!timeStart || !timeEnd) {
      setSelectedMeals([]);
      return;
    }
    const startHour = parseTimeToHour(timeStart);
    const endHour = parseTimeToHour(timeEnd);

    /*
    * Requirement:

      Meeting mulai sebelum jam 11.00, mendapat snack siang.
      Meeting jam 11.00-14.00, mendapat makan siang.
      Meeting di atas jam 14.00, mendapat snack sore.
    */

    const meals: string[] = [];
    if (startHour < 11) {
      meals.push('Snack Siang');
    }
    if (startHour <= 14) {
      meals.push('Makan Siang');
    }
    if (endHour > 14) {
      meals.push('Snack Sore');
    }

    setSelectedMeals([...new Set(meals)]);
  }, [timeStart, timeEnd]);

  useEffect(() => {
    const selectedMealPrices = mealTypes
      .filter((meal: any) => selectedMeals.includes(meal.name))
      .map((meal: any) => meal.maxPrice || 0);

    const totalMealPrice = selectedMealPrices.reduce((acc, curr) => acc + curr, 0);
    setTotalPrice(numberOfParticipants * totalMealPrice);
  }, [selectedMeals, numberOfParticipants, mealTypes]);

  const handleMealChange = (meal: string) => {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((m) => m !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const filtered = meetingRooms.filter((room: any) => room.officeId === unitId);
    setFilteredRooms(filtered);
    setCapacity(0);
    setSelectedRoomName('');
  };

  const handleRoomChange = (roomName: string) => {
    // console.log('Selected Room:', roomName);
    // selectedRoomNameRef.current = roomName;
    const selectedRoom = filteredRooms.find((room: any) => room.roomName === roomName);
    // console.log(selectedRoom, 'Selected Room Details');
    setCapacity(selectedRoom.capacity || 0);
    setSelectedRoomName(roomName);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleNumberOfParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^(?:[1-9][0-9]*)?$/;
    if (regex.test(value)) {
      const num = Number(value);
      if (num <= capacity || value === '') {
        setNumberOfParticipantsInput(value);
        setNumberOfParticipants(num);
      }
    }
  };

  const isFormValid =
    selectedUnitId &&
    selectedRoomName &&
    selectedDate &&
    timeStart &&
    timeEnd &&
    numberOfParticipants > 0 &&
    numberOfParticipants <= capacity &&
    selectedMeals.length > 0;

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with the following data:');
    console.log({
      unitId: selectedUnitId,
      roomName: selectedRoomName,
      date: selectedDate,
      timeStart,
      timeEnd,
      numberOfParticipants,
      meals: selectedMeals,
      totalPrice,
    });
    toast({
      title: 'Form submitted successfully!',
      description: 'Your meeting room booking has been saved.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
    // Reset form after submission
    handleResetForm();
  };

  const handleResetForm = () => {
    setSelectedUnitId('');
    setFilteredRooms([]);
    setCapacity(0);
    setSelectedRoomName('');
    setSelectedDate('');
    setTimeStart('');
    setTimeEnd('');
    setNumberOfParticipants(0);
    setNumberOfParticipantsInput('');
    setSelectedMeals([]);
    setTotalPrice(0);
  };

  return (
    <>
      <TopMainHeader>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="#333">
            Ruang Meeting
          </Text>
          <Breadcrumb color="gray.500" fontSize="sm">
            <BreadcrumbItem>
              <BreadcrumbLink>Ruang Meeting</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>Pesan Ruangan</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </TopMainHeader>
      <Box bg="white" borderRadius="lg" boxShadow="md" p={8}>
        <Text fontWeight="bold" fontSize="lg" mb={4}>
          Informasi Ruang Meeting
        </Text>
        <Box as="form" onSubmit={handleSubmitForm}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={4}>
            <FormControl isRequired>
              <FormLabel>Unit</FormLabel>
              <Select
                value={selectedUnitId}
                onChange={(e) => handleUnitChange(e.target.value)}
                data-testid="unit-select"
              >
                <option value="" disabled>
                  Pilih Unit
                </option>
                {units?.map((unit: any) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.officeName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Ruang Meeting</FormLabel>
              <Select value={selectedRoomName} onChange={(e) => handleRoomChange(e.target.value)}>
                <option value="" disabled>
                  Pilih Ruang Meeting
                </option>
                {filteredRooms?.map((room: any) => (
                  <option key={room.id} value={room.roomName}>
                    {room.roomName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={4}>
            <FormControl>
              <FormLabel>Kapasitas</FormLabel>
              <Input value={capacity} isReadOnly bg="#F2F2F2" />
            </FormControl>
          </Grid>
          <Divider my={6} />

          {/* Informasi Rapat */}
          <Text fontWeight="bold" fontSize="lg" mb={4}>
            Informasi Rapat
          </Text>
          {/* Tanggal Rapat */}
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6} mb={4}>
            <FormControl isRequired>
              <FormLabel>Tanggal Rapat</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  <Icon as={FiCalendar} />
                </InputLeftAddon>
                <Input
                  value={selectedDate}
                  placeholder="28 Juni 2022"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleDateChange(e.target.value)
                  }
                />
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Waktu Mulai</FormLabel>
              <Select value={timeStart} onChange={(e) => setTimeStart(e.target.value)}>
                <option value="" disabled>
                  Pilih Waktu Mulai
                </option>
                {time.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Waktu Selesai</FormLabel>
              <Select value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)}>
                <option value="" disabled>
                  Pilih Waktu Selesai
                </option>
                {timeEndOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Kapasitas */}
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={4}>
            <FormControl>
              <FormLabel>Jumlah Peserta</FormLabel>
              <Input
                value={numberOfParticipantsInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleNumberOfParticipantsChange(e)
                }
                placeholder="Masukkan Jumlah Peserta"
                inputMode="numeric"
                pattern="[0-9]*"
                max={capacity > 0 ? capacity : undefined}
              />
            </FormControl>
          </Grid>
          <FormControl mb={4}>
            <FormLabel>Jenis Konsumsi</FormLabel>
            <Stack>
              <Checkbox
                isChecked={selectedMeals.includes('Snack Siang')}
                onChange={() => handleMealChange('Snack Siang')}
              >
                Snack Siang
              </Checkbox>
              <Checkbox
                isChecked={selectedMeals.includes('Makan Siang')}
                onChange={() => handleMealChange('Makan Siang')}
              >
                Makan Siang
              </Checkbox>
              <Checkbox
                isChecked={selectedMeals.includes('Snack Sore')}
                onChange={() => handleMealChange('Snack Sore')}
              >
                Snack Sore
              </Checkbox>
            </Stack>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Nominal Konsumsi</FormLabel>
            <InputGroup>
              <InputLeftAddon>Rp.</InputLeftAddon>
              <Input value={totalPrice.toLocaleString('id-ID')} isReadOnly />
            </InputGroup>
          </FormControl>
          <Divider my={6} />
          <Flex justify="flex-end" gap={4}>
            <Button variant="ghost" color="red.400" type="reset" onClick={handleResetForm}>
              Batal
            </Button>
            <Button colorScheme="teal" isDisabled={!isFormValid} type="submit">
              Simpan
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default BookMeeting;
