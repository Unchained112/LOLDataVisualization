import sys
import csv

if len(sys.argv) < 3:
    print ("Usage: csvToTable.py csv_file html_file")
    exit(1)

# Open the CSV file for reading
reader = csv.reader(open(sys.argv[1]))

# Create the HTML file for output
htmlfile = open(sys.argv[2],"w")

# initialize rownum variable
rownum = 0

# write <table> tag
htmlfile.write('<table id=\'champion_table\' class="display">\n')

for row in reader: # Read a single row from the CSV file
    if rownum == 0:
        htmlfile.write('<thead><tr>') # write <tr> tag
        htmlfile.write('<th></th>\n')
        for column in row:
            htmlfile.write('<th>' + column + '</th>\n') # write header columns
        htmlfile.write('</tr></thead>\n<tbody>') # write </tr> tag
    else: # write all other rows
        colindex = 0
        htmlfile.write('<tr>\n')
        for column in row:
            if colindex == 0:
                title = str(column)
                if title == "Wukong":
                    title = "MonkeyKing"
                if title == "Dr. Mundo":
                    title = "DrMundo"
                if title == "Kai'Sa":
                    title = "Kaisa"
                if title == "Cho'Gath":
                    title = "Chogath"
                if title == "LeBlanc":
                    title = "Leblanc"
                title = ''.join(title.split())
                htmlfile.write('<td><img src=\'http://ddragon.leagueoflegends.com/cdn/11.5.1/img/champion/' + title + '.png\' height=50 width=50></img></td>\n')
            if colindex == 2 or colindex == 3 or colindex == 5:
                num = round(float(column)*100,1)
                htmlfile.write('<td>' + str(num) + '% </td>\n')
            else:
                htmlfile.write('<td>' + column + '</td>\n')
            colindex += 1
        htmlfile.write('</tr>\n')
    rownum += 1

# write </table> tag
htmlfile.write('</tbody>\n</table>')
exit(0)