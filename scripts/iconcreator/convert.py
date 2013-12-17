import PIL
from PIL import Image
import os, shutil


print("Tacnet.io Icon Converter")
print("")
print("1. Create two folders in the same directory as this file, input and output.")
print("2. Paste the images in the input folder. The images must end with .png or .jpg")
raw_input("Press Enter when ready...")

#try:

for file in os.listdir("input/"):
    if os.path.isfile("input/" + file) and (file[len(file)-4:len(file)] == ".png" or file[len(file)-4:len(file)] == ".jpg"):


        basewidth = 60

        img = Image.open("input/" + file)

        wpercent = (basewidth/float(img.size[0]))
        hsize = int((float(img.size[1])*float(wpercent)))
        img = img.resize((basewidth,hsize), PIL.Image.ANTIALIAS)


        filename_end = file[len(file)-4:len(file)]
        t_filename = file.lower().replace(" " , "_")[0:len(file)-4] + "_t" + filename_end
        b_filename = file.lower().replace(" " , "_")[0:len(file)-4] + "_b" + filename_end

        img.save("output/" + t_filename)

        shutil.copy2("input/" + file, "output/" + b_filename)

        print("Converted " + file + "..")

#except:
#    print("Error! Have you created the folders and activated virtualenv?")