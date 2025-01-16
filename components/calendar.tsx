import { StyleSheet, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarIA({ selectedRange, setSelectedRange }: any) {
  const screenWidth = Dimensions.get("window").width;

  const getMarkedDates = () => {
    const { startDate, endDate } = selectedRange;
    const markedDates: Record<string, any> = {};

    if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        color: "#70d7c7",
        textColor: "white",
      };

      if (endDate) {
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
          const dateStr = currentDate.toISOString().split("T")[0];
          if (dateStr !== startDate && dateStr !== endDate) {
            markedDates[dateStr] = {
              color: "#d9f2e6",
              textColor: "black",
            };
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        markedDates[endDate] = {
          endingDay: true,
          color: "#70d7c7",
          textColor: "white",
        };
      }
    }

    return markedDates;
  };

  const onDayPress = (day: any) => {
    if (
      !selectedRange.startDate ||
      (selectedRange.startDate && selectedRange.endDate)
    ) {
      // Start a new range
      setSelectedRange({ startDate: day.dateString, endDate: null });
    } else {
      // Set the end date
      const startDate = new Date(selectedRange.startDate);
      const endDate = new Date(day.dateString);

      if (endDate < startDate) {
        setSelectedRange({
          startDate: day.dateString,
          endDate: selectedRange.startDate,
        });
      } else {
        setSelectedRange((prev: any) => ({ ...prev, endDate: day.dateString }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType={"period"}
        markedDates={getMarkedDates()}
        onDayPress={onDayPress}
        style={{
          //   flex: 1,
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 10,
          height: 350,
          width: screenWidth - 20,
        }}
        theme={{
          backgroundColor: "rgba(245, 222, 179, 1)",
          calendarBackground: "rgba(245, 222, 179, 1)",
          textSectionTitleColor: "rgba(0, 0, 0, 0.5)",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#b6c1cd",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
